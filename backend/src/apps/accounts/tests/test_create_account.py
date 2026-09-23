import pytest
from rest_framework.test import APIClient

from apps.accounts.models import Account

from .mocks import MockAccountRepository, make_account_info

pytestmark = pytest.mark.django_db


# Tests that an authenticated client can create a new account using the repository.
def test_register_endpoint_creates_account(monkeypatch: pytest.MonkeyPatch) -> None:
    repository = MockAccountRepository()
    monkeypatch.setattr(
        "apps.accounts.api.views.DjangoAccountRepository",
        lambda: repository,
    )

    client = APIClient()
    client.force_authenticate(user=Account(id=99, username="admin"))

    response = client.post(
        "/api/accounts/register/",
        {
            "email": "ada@example.com",
            "password": "TestPass123!",
            "name": "Ada",
            "last_name": "Lovelace",
            "role": "member",
        },
    )

    assert response.status_code == 201
    assert response.json() == {
        "data": {
            "account_id": 1,
            "username": "ada",
            "email": "ada@example.com",
            "name": "Ada",
            "last_name": "Lovelace",
            "role": "member",
        }
    }
    assert len(repository.created_account_info) == 1


# Tests that duplicate account creation returns the expected business error.
def test_register_endpoint_returns_bad_request_when_account_already_exists(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    account_info = make_account_info(email="ada@example.com")
    repository = MockAccountRepository(
        account_info_by_email={
            "ada@example.com": account_info,
        },
    )
    monkeypatch.setattr(
        "apps.accounts.api.views.DjangoAccountRepository",
        lambda: repository,
    )

    client = APIClient()
    client.force_authenticate(user=account_info.account)

    response = client.post(
        "/api/accounts/register/",
        {
            "email": "ada@example.com",
            "password": "TestPass123!",
            "name": "Ada",
            "last_name": "Lovelace",
            "role": "member",
        },
    )

    assert response.status_code == 400
    assert response.json() == {
        "error": {
            "code": "ACCOUNT_ALREADY_EXISTS",
            "message": "An account with this email already exists.",
        }
    }
    assert repository.created_account_info == []
