"""Postgres connection for the ExamAI spine and knowledge tables.

Points at the Supreme AI Postgres (`docker-compose.postgres.yml` in that repo).
The blueprint's rule is that shared knowledge — syllabus, documents, questions,
solutions — lives in one relational database, because everything about it is
many-to-many or tree-shaped. Firestore keeps live per-user UI state; Firebase
keeps auth; Cloud Storage keeps files.

Nothing here creates the database. If it is not running:

    cd C:/SUPREME-AI && docker compose -f docker-compose.postgres.yml up -d
"""

from __future__ import annotations

import os
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator

import psycopg
from psycopg.rows import dict_row

DEFAULT_DSN = "postgresql://postgres:postgres@localhost:5432/supreme_media"

MIGRATIONS_DIR = Path(__file__).resolve().parent.parent / "migrations"


def dsn() -> str:
    return os.getenv("DATABASE_URL") or os.getenv("EXAMAI_DATABASE_URL") or DEFAULT_DSN


# Seconds to wait for a connection before giving up.
#
# Without this, an absent database is not a fast failure: "localhost" resolves
# to both ::1 and 127.0.0.1 and libpq tries each with the OS default timeout, so
# the test suite took four and a half minutes to report 12 skips on a machine
# with no Postgres. Anyone without Docker would reasonably conclude the suite
# was broken.
CONNECT_TIMEOUT = int(os.getenv("EXAMAI_DB_CONNECT_TIMEOUT", "5"))


def _dsn_with_timeout() -> str:
    raw = dsn()
    if "connect_timeout" in raw:
        return raw
    return f"{raw}{'&' if '?' in raw else '?'}connect_timeout={CONNECT_TIMEOUT}"


@contextmanager
def connect(autocommit: bool = False) -> Iterator[psycopg.Connection]:
    """A connection with dict rows.

    The error message is rewritten because the raw psycopg one ("connection
    failed: ... Connection refused") gives no hint that the fix is starting a
    container in a different repository.
    """
    try:
        conn = psycopg.connect(_dsn_with_timeout(), row_factory=dict_row, autocommit=autocommit)
    except psycopg.OperationalError as exc:
        raise RuntimeError(
            f"Cannot reach Postgres at {_safe_dsn()}.\n"
            "Start it with:\n"
            "  cd C:/SUPREME-AI && docker compose -f docker-compose.postgres.yml up -d\n"
            f"Original error: {exc}"
        ) from exc

    try:
        yield conn
        if not autocommit:
            conn.commit()
    except Exception:
        if not autocommit:
            conn.rollback()
        raise
    finally:
        conn.close()


def _safe_dsn() -> str:
    """The DSN with any password removed, for error messages and logs."""
    raw = dsn()
    if "@" not in raw:
        return raw
    scheme, _, rest = raw.partition("://")
    _, _, host = rest.partition("@")
    return f"{scheme}://***@{host}"


def migrate() -> list[str]:
    """Apply every .sql file in migrations/, in filename order.

    Deliberately not a migration framework. These files are written to be
    re-runnable (CREATE ... IF NOT EXISTS, CREATE OR REPLACE), so applying them
    all every time converges on the same schema — which is the property that
    matters while the schema is still moving. Swap in Drizzle or Alembic when
    the first destructive change appears.
    """
    applied: list[str] = []
    with connect() as conn:
        for path in sorted(MIGRATIONS_DIR.glob("*.sql")):
            conn.execute(path.read_text(encoding="utf-8"))
            applied.append(path.name)
    return applied
