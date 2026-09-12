"""Spine queries against a real Postgres.

Skipped automatically when no database is reachable, so the suite still runs on
a machine without Docker. To run them:

    cd C:/SUPREME-AI && docker compose -f docker-compose.postgres.yml up -d

These use their own `test.` program root and clean it up, so they never touch
imported BIT data sitting in the same database.
"""

from __future__ import annotations

import pytest

from app.syllabus.spine import SpineNode

try:
    from app.db import connect, migrate
    from app.syllabus import repository as repo

    with connect() as _probe:
        _probe.execute("SELECT 1")
    DB_AVAILABLE = True
except Exception:  # noqa: BLE001 — absence of a database is the thing being detected
    DB_AVAILABLE = False

pytestmark = [
    pytest.mark.integration,
    pytest.mark.skipif(not DB_AVAILABLE, reason="no Postgres reachable"),
]

ROOT = "test"


def node(path: str, kind: str, title: str, order: int = 0, code: str | None = None, hours=None):
    return SpineNode(
        id=path, path=path, kind=kind, title=title, order_index=order, code=code, hours=hours
    )


@pytest.fixture(scope="module", autouse=True)
def schema():
    migrate()
    yield


@pytest.fixture(autouse=True)
def clean():
    repo.delete_subtree(ROOT)
    yield
    repo.delete_subtree(ROOT)


@pytest.fixture
def tree():
    """A miniature spine: one course, two units, three topics."""
    nodes = [
        node(ROOT, "program", "Test Program"),
        node(f"{ROOT}.s4", "semester", "Semester 4", 4, "4"),
        node(f"{ROOT}.s4.os", "course", "Operating System", 0, "OSTEST", 45),
        node(f"{ROOT}.s4.os.u6", "unit", "Deadlocks", 5, "6", 7),
        node(f"{ROOT}.s4.os.u6.t1", "topic", "Introduction", 0, "6.a"),
        node(f"{ROOT}.s4.os.u6.t2", "topic", "Deadlock detection and recovery", 1, "6.d"),
        node(f"{ROOT}.s4.os.u7", "unit", "Real Time System", 6, "7", 2),
        node(f"{ROOT}.s4.os.u7.t1", "topic", "Introduction", 0, "7.a"),
    ]
    repo.upsert_nodes(nodes)
    return nodes


# ---------------------------------------------------------------------------
# The Phase 0 exit query
# ---------------------------------------------------------------------------


def test_all_topics_in_a_unit(tree):
    topics = repo.descendants(f"{ROOT}.s4.os.u6", kind="topic")

    assert [t["code"] for t in topics] == ["6.a", "6.d"]
    # A sibling unit's topics must not leak in — `<@` is a subtree test, and
    # getting it wrong would quietly widen every downstream topic query.
    assert all("u6" in t["path"] for t in topics)


def test_subtree_excludes_the_node_itself(tree):
    everything = repo.descendants(f"{ROOT}.s4.os")
    paths = {n["path"] for n in everything}

    assert f"{ROOT}.s4.os" not in paths
    assert len(everything) == 5  # 2 units + 3 topics


def test_depth_limit_gets_only_direct_children(tree):
    units = repo.descendants(f"{ROOT}.s4.os", max_depth=1)
    assert {u["code"] for u in units} == {"6", "7"}


def test_ancestors_give_breadcrumbs_in_order(tree):
    chain = repo.ancestors(f"{ROOT}.s4.os.u6.t2")

    assert [a["kind"] for a in chain] == ["program", "semester", "course", "unit", "topic"]
    assert chain[-1]["title"] == "Deadlock detection and recovery"


def test_subtree_renders_as_a_nested_tree(tree):
    root = repo.subtree(f"{ROOT}.s4.os")

    assert root is not None and root.kind == "course"
    assert [c.code for c in root.children] == ["6", "7"]
    assert len(root.children[0].children) == 2

    rendered = list(repo.render_tree(root))
    assert rendered[0].startswith("OSTEST Operating System")
    assert any("Deadlock detection" in line for line in rendered)


def test_units_sort_by_number_not_text(tree):
    """Unit 10 must come after unit 7, which string ordering would get wrong."""
    repo.upsert_nodes([node(f"{ROOT}.s4.os.u10", "unit", "Case Study", 9, "10")])
    units = repo.descendants(f"{ROOT}.s4.os", kind="unit")

    ordered = sorted(units, key=lambda u: int(u["code"]))
    assert [u["code"] for u in ordered] == ["6", "7", "10"]


# ---------------------------------------------------------------------------
# Integrity
# ---------------------------------------------------------------------------


def test_a_node_cannot_be_inserted_without_its_parent(tree):
    """ltree stores one path value, so nothing in the type system stops an orphan.

    Without the trigger, a topic under a missing unit inserts happily and then
    vanishes from every rendered tree — present in the table, unreachable by
    navigation.
    """
    with pytest.raises(Exception, match="has no parent"):
        repo.upsert_nodes([node(f"{ROOT}.s4.os.u99.t1", "topic", "Orphan")])


def test_reimport_updates_in_place_rather_than_duplicating(tree):
    before = len(repo.descendants(ROOT))

    repo.upsert_nodes([node(f"{ROOT}.s4.os.u6", "unit", "Deadlocks (revised)", 5, "6", 8)])

    assert len(repo.descendants(ROOT)) == before
    unit = repo.get_node(f"{ROOT}.s4.os.u6")
    assert unit["title"] == "Deadlocks (revised)"
    assert float(unit["hours"]) == 8


def test_reimport_preserves_observed_marks_weight(tree):
    """marks_weight is computed from real papers; a syllabus re-import must not wipe it.

    The syllabus says what is taught; marks_weight says what is actually asked.
    Overwriting the second with the first would destroy the only signal that
    makes the pass planner better than reading the syllabus.
    """
    with connect() as conn:
        conn.execute(
            "UPDATE examai.syllabus_nodes SET marks_weight = 12.5 WHERE path = %s::ltree",
            (f"{ROOT}.s4.os.u6",),
        )

    repo.upsert_nodes([node(f"{ROOT}.s4.os.u6", "unit", "Deadlocks", 5, "6", 7)])

    assert float(repo.get_node(f"{ROOT}.s4.os.u6")["marks_weight"]) == 12.5


def test_delete_subtree_removes_descendants(tree):
    removed = repo.delete_subtree(f"{ROOT}.s4.os.u6")

    assert removed == 3  # the unit and its two topics
    assert repo.get_node(f"{ROOT}.s4.os.u6.t1") is None
    assert repo.get_node(f"{ROOT}.s4.os.u7") is not None


def test_course_lookup_is_case_insensitive(tree):
    assert repo.find_course("ostest")["path"] == f"{ROOT}.s4.os"
    assert repo.find_course("OSTEST")["title"] == "Operating System"


def test_unknown_kind_is_rejected(tree):
    with pytest.raises(Exception):
        repo.upsert_nodes([node(f"{ROOT}.s4.os.u6.t3", "chapter", "Wrong kind")])
