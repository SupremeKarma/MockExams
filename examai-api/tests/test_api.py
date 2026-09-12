"""Worker API surface.

The auth tests here matter more than they look. This service holds Firebase
Admin credentials and can write any paper in the project, and it deliberately
does NOT verify Firebase user tokens — the Next.js routes do that. The internal
key is therefore the only thing between a request and admin-level write access,
so "refuses without it" is a security property, not a nicety.
"""

from __future__ import annotations

import importlib

import pytest
from fastapi.testclient import TestClient


def client_with_key(monkeypatch: pytest.MonkeyPatch, key: str | None) -> TestClient:
    """Rebuild the app with a given internal key (config reads env at import)."""
    from app import config

    monkeypatch.setattr(config, "INTERNAL_API_KEY", key)
    main = importlib.import_module("app.main")
    return TestClient(main.app)


def test_health_reports_the_configured_models(monkeypatch: pytest.MonkeyPatch):
    response = client_with_key(monkeypatch, "k").get("/health")
    assert response.status_code == 200

    body = response.json()
    assert body["ok"] is True
    # An operator debugging a cost or quality surprise needs to see which model
    # actually ran, not which one the docs say should have.
    assert set(body["models"]) == {"ocr", "solve", "cheap"}
    assert body["authConfigured"] is True


def test_stage_requires_the_internal_key(monkeypatch: pytest.MonkeyPatch):
    client = client_with_key(monkeypatch, "right-key")

    assert client.post("/stages/extract", json={}).status_code == 401
    assert (
        client.post("/stages/extract", headers={"X-Internal-Key": "wrong"}, json={}).status_code
        == 401
    )


def test_unconfigured_key_refuses_everything_rather_than_running_open(
    monkeypatch: pytest.MonkeyPatch,
):
    """A missing key must fail closed.

    Defaulting to "no key required" would leave a service that can overwrite any
    paper reachable by anyone who can route to it — and it would look like it was
    working, which is the worst version of this mistake.
    """
    client = client_with_key(monkeypatch, None)
    response = client.post("/stages/extract", headers={"X-Internal-Key": "anything"}, json={})

    assert response.status_code == 503
    assert "EXAMAI_INTERNAL_API_KEY" in response.json()["detail"]


def test_malformed_extract_request_is_rejected_before_any_work(
    monkeypatch: pytest.MonkeyPatch,
):
    client = client_with_key(monkeypatch, "k")
    response = client.post(
        "/stages/extract",
        headers={"X-Internal-Key": "k"},
        # image_paths is empty — there is nothing to extract from.
        json={"paper_id": "BIT351CO_2025_regular", "course_id": "BIT351CO", "year": 2025,
              "image_paths": []},
    )
    assert response.status_code == 422


def test_job_status_requires_the_key(monkeypatch: pytest.MonkeyPatch):
    client = client_with_key(monkeypatch, "k")
    assert client.get("/jobs/BIT351CO_2025_regular/extract").status_code == 401
