"""The only module that touches the spine tables.

Everything else — the import CLI, the API routes, the content pipeline — goes
through here. That is a deliberate constraint: the blueprint expects this to
move into Supreme AI's knowledge service eventually, and confining every query
to one module makes that a file move rather than a search for stray SQL.

Two rules the rest of the codebase relies on:

  * **`uuid` is the only foreign key.** Paths change — a unit gets renumbered, a
    course code is revised — and anything holding `bit.s4.bit253co.u6` would
    then point at a different topic, silently, because the new row is perfectly
    valid. `path` is for tree queries and URLs only.

  * **A node's uuid survives re-import.** The upsert keys on `path`, so
    re-running the importer updates rows in place and every link that pointed
    at a node still does. There is a test for this; it is the property that
    makes links durable.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Iterable, Sequence

from ..db import connect
from .spine import SpineNode

# Columns every read returns, so callers see one shape.
_NODE_COLUMNS = (
    "uuid::text, path::text, kind, code, title, order_index, hours, "
    "marks_weight, syllabus_version, status, official_ref"
)


@dataclass
class TreeNode:
    uuid: str
    path: str
    kind: str
    code: str | None
    title: str
    order_index: int
    hours: float | None
    status: str
    children: list["TreeNode"]

    @property
    def depth(self) -> int:
        return self.path.count(".")


# ---------------------------------------------------------------------------
# Writing
# ---------------------------------------------------------------------------

_UPSERT = """
INSERT INTO examai.syllabus_nodes
    (path, kind, code, title, order_index, hours, official_ref, syllabus_version, status)
VALUES
    (%(path)s, %(kind)s, %(code)s, %(title)s, %(order_index)s, %(hours)s,
     %(official_ref)s, %(syllabus_version)s, %(status)s)
ON CONFLICT (path) DO UPDATE SET
    kind             = EXCLUDED.kind,
    code             = EXCLUDED.code,
    title            = EXCLUDED.title,
    order_index      = EXCLUDED.order_index,
    hours            = EXCLUDED.hours,
    official_ref     = EXCLUDED.official_ref,
    syllabus_version = EXCLUDED.syllabus_version,
    status           = EXCLUDED.status
RETURNING uuid::text
"""


def upsert_nodes(
    nodes: Sequence[SpineNode],
    *,
    syllabus_version: str | None = None,
    status: str = "active",
) -> dict[str, str]:
    """Insert or update spine nodes. Returns {path: uuid}.

    Ancestors must come before descendants — the database rejects a node whose
    parent is missing — so callers pass the ordered list `build_course_nodes`
    returns rather than assembling their own.

    `marks_weight` is deliberately never written. It holds observed exam weight
    computed from real papers; the syllabus says what is *taught*, and letting a
    re-import overwrite one with the other would destroy the only signal that
    makes the pass planner better than reading the syllabus.
    """
    if not nodes:
        return {}

    written: dict[str, str] = {}
    with connect() as conn:
        with conn.cursor() as cur:
            for node in nodes:
                cur.execute(
                    _UPSERT,
                    {
                        "path": node.path,
                        "kind": node.kind,
                        "code": node.code,
                        "title": node.title,
                        "order_index": node.order_index,
                        "hours": node.hours,
                        "official_ref": node.official_ref,
                        # Only program and course nodes carry a revision label;
                        # everything beneath inherits it by position.
                        "syllabus_version": (
                            syllabus_version if node.kind in ("program", "course") else None
                        ),
                        "status": status,
                    },
                )
                row = cur.fetchone()
                written[node.path] = row["uuid"]
    return written


def delete_subtree(path: str) -> int:
    """Remove a node and everything under it.

    Used before re-importing a course so units dropped from a revised syllabus
    do not linger. Note this cascades to document_topics and question_topics —
    which is correct (a link to a unit that no longer exists is worse than no
    link) but means it should not be run casually against a course with content.
    """
    with connect() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM examai.syllabus_nodes WHERE path <@ %s::ltree", (path,))
            return cur.rowcount


def set_status(path: str, status: str, include_descendants: bool = True) -> int:
    """Promote a draft subtree to active, or retire one.

    OCR'd imports land as `draft` and nothing student-facing reads them (see the
    published_syllabus view). A human confirms against the scan, then calls
    this.
    """
    if status not in ("draft", "active", "retired"):
        raise ValueError(f"unknown status {status!r}")

    clause = "path <@ %(path)s::ltree" if include_descendants else "path = %(path)s::ltree"
    with connect() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"UPDATE examai.syllabus_nodes SET status = %(status)s WHERE {clause}",
                {"path": path, "status": status},
            )
            return cur.rowcount


# ---------------------------------------------------------------------------
# Reading — the queries the spine exists for
# ---------------------------------------------------------------------------


def descendants(
    path: str,
    kind: str | None = None,
    max_depth: int | None = None,
    include_drafts: bool = False,
) -> list[dict[str, Any]]:
    """Everything under `path`, optionally filtered by kind or depth.

    The Phase 0 exit query. "All topics in Unit 6" is:

        descendants("bit.s4.bit253co.u6", kind="topic")
    """
    sql = [
        f"SELECT {_NODE_COLUMNS}",
        "FROM examai.syllabus_nodes",
        "WHERE path <@ %(path)s::ltree AND path <> %(path)s::ltree",
    ]
    params: dict[str, Any] = {"path": path}

    if not include_drafts:
        sql.append("AND status = 'active'")
    if kind:
        sql.append("AND kind = %(kind)s")
        params["kind"] = kind
    if max_depth is not None:
        sql.append("AND nlevel(path) <= nlevel(%(path)s::ltree) + %(depth)s")
        params["depth"] = max_depth

    # Sorting by path gives print order without a recursive walk, because the
    # position is encoded in the path itself (u6.t4).
    sql.append("ORDER BY nlevel(path), path")

    with connect() as conn:
        return [dict(row) for row in conn.execute(" ".join(sql), params).fetchall()]


def ancestors(path: str) -> list[dict[str, Any]]:
    """The chain from program down to this node — breadcrumbs, in one query."""
    with connect() as conn:
        return [
            dict(row)
            for row in conn.execute(
                f"SELECT {_NODE_COLUMNS} FROM examai.syllabus_nodes "
                "WHERE path @> %(path)s::ltree ORDER BY nlevel(path)",
                {"path": path},
            ).fetchall()
        ]


def get_node(path: str) -> dict[str, Any] | None:
    with connect() as conn:
        row = conn.execute(
            f"SELECT {_NODE_COLUMNS} FROM examai.syllabus_nodes WHERE path = %s::ltree",
            (path,),
        ).fetchone()
    return dict(row) if row else None


def get_node_by_uuid(node_uuid: str) -> dict[str, Any] | None:
    with connect() as conn:
        row = conn.execute(
            f"SELECT {_NODE_COLUMNS} FROM examai.syllabus_nodes WHERE uuid = %s",
            (node_uuid,),
        ).fetchone()
    return dict(row) if row else None


def find_course(code: str) -> dict[str, Any] | None:
    with connect() as conn:
        row = conn.execute(
            f"SELECT {_NODE_COLUMNS} FROM examai.syllabus_nodes "
            "WHERE kind = 'course' AND upper(code) = upper(%s)",
            (code,),
        ).fetchone()
    return dict(row) if row else None


def courses(semester: int | None = None, program: str = "bit") -> list[dict[str, Any]]:
    root = f"{program}.s{semester}" if semester else program
    return descendants(root, kind="course")


def find_unit_by_number(course_code: str, unit_number: int) -> dict[str, Any] | None:
    """The unit node printed as number `unit_number` in `course_code`'s syllabus.

    Builds the path directly (`{course_path}.u{N}`) rather than searching by
    `code`, because path IS the unit number by construction — see
    `syllabus_nodes_require_parent` and `app/syllabus/spine.py`.
    """
    course = find_course(course_code)
    if course is None:
        return None
    return get_node(f"{course['path']}.u{unit_number}")


def leaf_topics(course_path: str) -> list[dict[str, Any]]:
    """The deepest OFFICIAL node under each unit — what content attaches to.

    Topics where the syllabus defines them; the unit itself where it lists its
    contents as prose. Database Management System has 9 units and 0 topics, so a
    topics-only query would say that course has nothing to write notes about.
    """
    units = descendants(course_path, kind="unit")
    out: list[dict[str, Any]] = []
    for unit in units:
        topics = descendants(unit["path"], kind="topic")
        out.extend(topics if topics else [unit])
    return out


def subtree(path: str, include_drafts: bool = False) -> TreeNode | None:
    """The whole subtree as a nested structure, for rendering.

    One flat query assembled in memory: a course with 9 units and 34 topics
    would otherwise be 44 round trips to draw one tree.
    """
    sql = [
        f"SELECT {_NODE_COLUMNS} FROM examai.syllabus_nodes",
        "WHERE path <@ %(path)s::ltree",
    ]
    if not include_drafts:
        sql.append("AND status = 'active'")
    sql.append("ORDER BY nlevel(path), path")

    with connect() as conn:
        rows = conn.execute(" ".join(sql), {"path": path}).fetchall()

    if not rows:
        return None

    by_path: dict[str, TreeNode] = {}
    root: TreeNode | None = None

    for row in rows:
        node = TreeNode(
            uuid=row["uuid"],
            path=row["path"],
            kind=row["kind"],
            code=row["code"],
            title=row["title"],
            order_index=row["order_index"],
            hours=float(row["hours"]) if row["hours"] is not None else None,
            status=row["status"],
            children=[],
        )
        by_path[node.path] = node

        parent_path = node.path.rsplit(".", 1)[0]
        parent = by_path.get(parent_path) if parent_path != node.path else None
        if parent is None:
            root = root or node
        else:
            parent.children.append(node)

    return root


def render_tree(node: TreeNode, indent: int = 0) -> Iterable[str]:
    """Plain-text tree, for the Phase 0 exit check and CLI output."""
    hours = f"  [{node.hours:g} Hrs]" if node.hours else ""
    code = f"{node.code} " if node.code else ""
    draft = "  (draft)" if node.status == "draft" else ""
    yield f"{'  ' * indent}{code}{node.title}{hours}{draft}"
    for child in node.children:
        yield from render_tree(child, indent + 1)


def counts_by_kind(include_drafts: bool = True) -> dict[str, int]:
    clause = "" if include_drafts else "WHERE status = 'active'"
    with connect() as conn:
        rows = conn.execute(
            f"SELECT kind, count(*) AS n FROM examai.syllabus_nodes {clause} GROUP BY kind"
        ).fetchall()
    return {row["kind"]: row["n"] for row in rows}


# ---------------------------------------------------------------------------
# Question links
# ---------------------------------------------------------------------------


def link_question(
    question_ref: str,
    node_uuid: str,
    *,
    role: str = "primary",
    weight: float = 1.0,
    tagged_by: str = "model",
) -> None:
    """Tag a question to a syllabus node.

    Any node kind is accepted by design — link to the deepest OFFICIAL node,
    which is the unit for a course whose syllabus lists prose rather than
    numbered topics.
    """
    with connect() as conn:
        conn.execute(
            """
            INSERT INTO examai.question_topics (question_ref, node_uuid, role, weight, tagged_by)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (question_ref, node_uuid) DO UPDATE SET
                role = EXCLUDED.role, weight = EXCLUDED.weight, tagged_by = EXCLUDED.tagged_by
            """,
            (question_ref, node_uuid, role, weight, tagged_by),
        )


def unlink_model_tags(question_ref: str) -> int:
    """Drop this question's model-tagged links, keeping any human ones.

    Called before re-inserting from a fresh extraction, so a unit tag the model
    no longer produces does not linger. Human links are untouched — a
    reviewer's tag outranks a re-extraction the same way `syllabusUnits`'s
    `taggedBy` does in Firestore.
    """
    with connect() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "DELETE FROM examai.question_topics WHERE question_ref = %s AND tagged_by = 'model'",
                (question_ref,),
            )
            return cur.rowcount


def unlink_question(question_ref: str) -> int:
    """Drop every link for a question, model and human alike.

    Used when the question itself is gone — a re-extraction that no longer
    produces it — where a stale link (rather than a stale tag) is the problem.
    """
    with connect() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "DELETE FROM examai.question_topics WHERE question_ref = %s", (question_ref,)
            )
            return cur.rowcount


def questions_for_node(path: str, include_descendants: bool = True) -> list[dict[str, Any]]:
    """Every question tagged to a node or anything beneath it.

    "All questions in Unit 6" without a recursive walk — the reason the spine is
    an ltree.
    """
    operator = "<@" if include_descendants else "="
    with connect() as conn:
        return [
            dict(row)
            for row in conn.execute(
                f"""
                SELECT qt.question_ref, qt.role, qt.weight, n.path::text, n.title
                FROM examai.question_topics qt
                JOIN examai.syllabus_nodes n ON n.uuid = qt.node_uuid
                WHERE n.path {operator} %(path)s::ltree
                ORDER BY n.path
                """,
                {"path": path},
            ).fetchall()
        ]
