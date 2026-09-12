"""Read-only syllabus endpoints.

The spine is public reference material — it is the university's published
syllabus, which the app already shows students — so these sit outside the
internal-key guard that protects the write/ingest endpoints. Nothing here can
mutate anything; imports run from the CLI.
"""

from __future__ import annotations

import asyncio
from typing import Any

from fastapi import APIRouter, HTTPException, Query

from .syllabus import repository as repo

router = APIRouter(prefix="/syllabus", tags=["syllabus"])


def _tree_to_dict(node: repo.TreeNode) -> dict[str, Any]:
    return {
        "uuid": node.uuid,
        "path": node.path,
        "kind": node.kind,
        "code": node.code,
        "title": node.title,
        "hours": node.hours,
        "children": [_tree_to_dict(child) for child in node.children],
    }


@router.get("/courses")
async def list_courses(
    semester: int | None = Query(default=None, ge=1, le=8),
    program: str = "bit",
) -> dict[str, Any]:
    rows = await asyncio.to_thread(repo.courses, semester, program)
    return {"courses": rows}


@router.get("/tree/{path}")
async def get_tree(path: str) -> dict[str, Any]:
    """A whole subtree, nested — what the Reader's left pane renders.

    One flat query assembled in memory rather than a query per level: a course
    with 9 units and 34 topics would otherwise be 44 round trips to draw once.
    """
    root = await asyncio.to_thread(repo.subtree, path)
    if root is None:
        raise HTTPException(status_code=404, detail=f"Nothing in the syllabus at {path!r}.")
    return _tree_to_dict(root)


@router.get("/node/{path}")
async def get_node(path: str) -> dict[str, Any]:
    node = await asyncio.to_thread(repo.get_node, path)
    if node is None:
        raise HTTPException(status_code=404, detail=f"No syllabus node {path!r}.")

    breadcrumbs = await asyncio.to_thread(repo.ancestors, node["path"])
    return {"node": node, "breadcrumbs": breadcrumbs}


@router.get("/topics/{path}")
async def topics_under(path: str) -> dict[str, Any]:
    """Every topic beneath a path — a unit, a course, or a whole semester.

    This is the query the spine exists to serve: one indexed `<@` rather than a
    recursive walk, and it reads the same at any level of the tree.
    """
    rows = await asyncio.to_thread(repo.descendants, path, "topic")
    return {"path": path, "count": len(rows), "topics": rows}
