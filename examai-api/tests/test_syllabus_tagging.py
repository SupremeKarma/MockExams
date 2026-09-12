"""Resolving unit tags to spine nodes and syncing question_topics.

Skipped automatically when no database is reachable — see
test_syllabus_repository.py for why, and how to bring one up.

Each test gets its own root path (`root` fixture) rather than sharing one
constant the way test_syllabus_repository.py's tests do. That file's tests
observably tolerate a shared root; this file's writes many links per test
across sibling units and re-syncs the same question_ref repeatedly, and a
shared root proved to interact between tests in this file — flaky failures
that vanished when each test ran alone. Giving every test a disjoint subtree
removes the possibility of cross-test interaction outright, whatever its exact
mechanism, rather than relying on `clean`-fixture ordering to prevent it.
"""

from __future__ import annotations

import itertools

import pytest

from app.syllabus import tagging
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

_root_counter = itertools.count()


def node(path: str, kind: str, title: str, order: int = 0, code: str | None = None, hours=None):
    return SpineNode(
        id=path, path=path, kind=kind, title=title, order_index=order, code=code, hours=hours
    )


@pytest.fixture(scope="module", autouse=True)
def schema():
    migrate()
    yield


@pytest.fixture
def root():
    """A root path this test alone owns, torn down after it runs."""
    value = f"tagtest{next(_root_counter)}"
    repo.delete_subtree(value)
    yield value
    repo.delete_subtree(value)


@pytest.fixture
def tree(root):
    """Mirrors the real OSTEST shape: Deadlocks really is unit 6."""
    nodes = [
        node(root, "program", "Test Program"),
        node(f"{root}.s4", "semester", "Semester 4", 4, "4"),
        node(f"{root}.s4.bit253co", "course", "Operating System", 0, "OSTEST", 45),
        node(f"{root}.s4.bit253co.u5", "unit", "Input/Output", 4, "5", 7),
        node(f"{root}.s4.bit253co.u6", "unit", "Deadlocks", 5, "6", 7),
        node(f"{root}.s4.bit253co.u6.t4", "topic", "Deadlock detection and recovery", 3, "6.d"),
        node(f"{root}.s4.bit253co.u7", "unit", "Real Time System", 6, "7", 2),
    ]
    repo.upsert_nodes(nodes)
    return nodes


# ---------------------------------------------------------------------------
# parse_unit_id — pure, no database needed
# ---------------------------------------------------------------------------


def test_parses_subject_and_number():
    assert tagging.parse_unit_id("OSTEST_U06") == ("OSTEST", 6)


def test_does_not_zero_pad_on_the_way_back_out():
    # U06 -> 6, not "06" — the path segment is u6, never u06.
    course, number = tagging.parse_unit_id("OSTEST_U11")
    assert (course, number) == ("OSTEST", 11)


@pytest.mark.parametrize("bad", ["OSTEST", "OSTEST_6", "U06", ""])
def test_rejects_anything_not_shaped_like_a_unit_id(bad):
    assert tagging.parse_unit_id(bad) is None


# ---------------------------------------------------------------------------
# resolve_unit_node
# ---------------------------------------------------------------------------


def test_resolves_a_known_unit(tree, root):
    node_row = tagging.resolve_unit_node("OSTEST_U06")
    assert node_row is not None
    assert node_row["title"] == "Deadlocks"
    assert node_row["path"] == f"{root}.s4.bit253co.u6"


def test_unresolvable_shape_returns_none_not_an_error(tree):
    assert tagging.resolve_unit_node("not-a-unit-id") is None


def test_unit_past_the_course_end_returns_none(tree):
    # The course only goes up to unit 7 in this fixture.
    assert tagging.resolve_unit_node("OSTEST_U99") is None


def test_unimported_course_returns_none(tree):
    assert tagging.resolve_unit_node("BIT999CO_U01") is None


# ---------------------------------------------------------------------------
# sync_question_topics
# ---------------------------------------------------------------------------


def test_links_a_model_tag(tree, root):
    outcome = tagging.sync_question_topics(
        "PAPER_2026/B1", [{"unitId": "OSTEST_U06", "taggedBy": "model"}]
    )

    assert outcome == {"linked": 1, "unresolved": 0}
    linked = repo.questions_for_node(f"{root}.s4.bit253co.u6")
    assert [row["question_ref"] for row in linked] == ["PAPER_2026/B1"]
    assert linked[0]["role"] == "primary"


def test_unresolvable_tag_is_counted_not_silently_dropped(tree):
    outcome = tagging.sync_question_topics(
        "PAPER_2026/B2", [{"unitId": "garbage", "taggedBy": "model"}]
    )
    assert outcome == {"linked": 0, "unresolved": 1}


def test_second_tag_links_as_secondary(tree, root):
    tagging.sync_question_topics(
        "PAPER_2026/B3",
        [
            {"unitId": "OSTEST_U06", "taggedBy": "model"},
            {"unitId": "OSTEST_U07", "taggedBy": "model"},
        ],
    )
    u6_links = repo.questions_for_node(f"{root}.s4.bit253co.u6", include_descendants=False)
    u7_links = repo.questions_for_node(f"{root}.s4.bit253co.u7", include_descendants=False)
    assert u6_links[0]["role"] == "primary"
    assert u7_links[0]["role"] == "secondary"


def test_re_sync_drops_a_tag_the_model_no_longer_produces(tree, root):
    tagging.sync_question_topics(
        "PAPER_2026/B4", [{"unitId": "OSTEST_U06", "taggedBy": "model"}]
    )
    tagging.sync_question_topics(
        "PAPER_2026/B4", [{"unitId": "OSTEST_U07", "taggedBy": "model"}]
    )

    u6_links = repo.questions_for_node(f"{root}.s4.bit253co.u6", include_descendants=False)
    u7_links = repo.questions_for_node(f"{root}.s4.bit253co.u7", include_descendants=False)
    assert u6_links == []
    assert [row["question_ref"] for row in u7_links] == ["PAPER_2026/B4"]


def test_re_sync_never_drops_a_human_tag(tree, root):
    tagging.sync_question_topics(
        "PAPER_2026/B5",
        [
            {"unitId": "OSTEST_U06", "taggedBy": "human"},
            {"unitId": "OSTEST_U07", "taggedBy": "model"},
        ],
    )
    # A re-run whose model tags no longer include either unit — a re-extraction
    # of a paper the reviewer already corrected.
    tagging.sync_question_topics("PAPER_2026/B5", [])

    u6_links = repo.questions_for_node(f"{root}.s4.bit253co.u6", include_descendants=False)
    u7_links = repo.questions_for_node(f"{root}.s4.bit253co.u7", include_descendants=False)
    assert [row["question_ref"] for row in u6_links] == ["PAPER_2026/B5"]
    assert u7_links == []


def test_unlink_question_removes_both_kinds(tree, root):
    tagging.sync_question_topics(
        "PAPER_2026/B6",
        [
            {"unitId": "OSTEST_U06", "taggedBy": "human"},
            {"unitId": "OSTEST_U07", "taggedBy": "model"},
        ],
    )
    repo.unlink_question("PAPER_2026/B6")

    assert repo.questions_for_node(f"{root}.s4.bit253co.u6", include_descendants=False) == []
    assert repo.questions_for_node(f"{root}.s4.bit253co.u7", include_descendants=False) == []
