#!/usr/bin/env python
"""Create the login users that the app connects as.

The group roles `examai_writer` and `examai_reader` are created by migration
004 and carry the privileges. They are NOLOGIN: a migration file that created a
password would put that password in git. This script creates the LOGIN users and
grants them a group, taking passwords from the environment.

    EXAMAI_WRITER_PASSWORD=... EXAMAI_READER_PASSWORD=... \
        python scripts/setup_db_roles.py

Both default to a local development password when unset, and the script refuses
to use that default against anything but localhost.

Why two connections rather than one with checks in code: the Reader's
connection physically cannot read a draft. A missing WHERE clause in a Reader
query returns "permission denied", not an unreviewed page. See
migrations/004_roles_views.sql.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.db import connect, dsn  # noqa: E402

DEV_PASSWORD = "examai_dev_only"

WRITER_USER = os.getenv("EXAMAI_WRITER_USER", "examai_app")
READER_USER = os.getenv("EXAMAI_READER_USER", "examai_web")


def _password(var: str) -> str:
    value = os.getenv(var)
    if value:
        return value

    target = dsn()
    if "localhost" not in target and "127.0.0.1" not in target:
        raise SystemExit(
            f"{var} is not set and the target database is not local ({target.split('@')[-1]}). "
            "Refusing to create a login role with the shared development password."
        )
    return DEV_PASSWORD


def main() -> int:
    writer_password = _password("EXAMAI_WRITER_PASSWORD")
    reader_password = _password("EXAMAI_READER_PASSWORD")

    # DDL cannot take bind parameters, and a DO $$ block's body is a string
    # literal so placeholders inside it are never substituted. psycopg.sql
    # composes the identifiers and the password literal with correct quoting
    # instead of f-string concatenation.
    from psycopg import sql as pg

    def upsert_login(conn, name: str, password: str) -> None:
        exists = conn.execute(
            "SELECT 1 FROM pg_roles WHERE rolname = %s", (name,)
        ).fetchone()
        action = pg.SQL("ALTER ROLE" if exists else "CREATE ROLE")
        conn.execute(
            pg.SQL("{action} {role} WITH LOGIN PASSWORD {password}").format(
                action=action,
                role=pg.Identifier(name),
                password=pg.Literal(password),
            )
        )

    with connect() as conn:
        upsert_login(conn, WRITER_USER, writer_password)
        upsert_login(conn, READER_USER, reader_password)

        for statement in (
            pg.SQL("GRANT examai_writer TO {}").format(pg.Identifier(WRITER_USER)),
            pg.SQL("GRANT examai_reader TO {}").format(pg.Identifier(READER_USER)),
            # The reader must own nothing. Ownership bypasses grants, and RLS
            # does not apply to a table's owner unless FORCEd — so a reader that
            # owned anything would be a reader that could read drafts.
            pg.SQL("REVOKE ALL ON SCHEMA examai FROM {}").format(pg.Identifier(READER_USER)),
            pg.SQL("GRANT USAGE ON SCHEMA examai TO {}").format(pg.Identifier(READER_USER)),
            # Deny the ambient rights a fresh role gets in the public schema, so
            # it cannot create scratch tables of its own anywhere.
            pg.SQL("REVOKE CREATE ON SCHEMA public FROM {}").format(pg.Identifier(READER_USER)),
        ):
            conn.execute(statement)

    print(f"writer login: {WRITER_USER}  (group examai_writer)")
    print(f"reader login: {READER_USER}  (group examai_reader, SELECT on published_* views only)")

    if writer_password == DEV_PASSWORD or reader_password == DEV_PASSWORD:
        print(
            "\nNOTE: using the shared development password. Set "
            "EXAMAI_WRITER_PASSWORD / EXAMAI_READER_PASSWORD before deploying anywhere real."
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
