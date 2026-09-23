import pytest
from rest_framework.test import APIClient

from apps.accounts.application.selectors import get_user_info_by_email
from apps.accounts.exceptions import UserInfoNotFoundError

from .mocks import MockAccountRepository, make_account_info


# Tests that the selector returns the user info dictionary from the repository.
def test_get_user_info_by_email_returns_user_info_dictionary() -> None:
    account_info = make_account_info(email="ada@example.com")
    repository = MockAccountRepository(
        account_info_by_email={
            "ada@example.com": account_info,
        },
    )

    result = get_user_info_by_email(
        email="ada@example.com",
        repository=repository,
    )

    assert result == {
        "account_id": account_info.id,
        "email": "ada@example.com",
        "name": "Ada",
        "last_name": "Lovelace",
        "role": "member",
    }


# Tests that the selector raises the user-not-found error for a missing email.
def test_get_user_info_by_email_raises_when_user_info_does_not_exist() -> None:
    repository = MockAccountRepository()

    with pytest.raises(UserInfoNotFoundError):
        get_user_info_by_email(
            email="missing@example.com",
            repository=repository,
        )


# Tests that an authenticated client can read user info by email.
def test_user_info_endpoint_returns_user_info_by_email(
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

    response = client.get(
        "/api/accounts/user-info/",
        {"email": "ada@example.com"},
    )

    assert response.status_code == 200
    assert response.json() == {
        "data": {
            "account_id": account_info.id,
            "email": "ada@example.com",
            "name": "Ada",
            "last_name": "Lovelace",
            "role": "member",
        }
    }


# Tests that the endpoint returns the user-not-found response for a missing email.
def test_user_info_endpoint_returns_not_found_when_user_info_does_not_exist(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    account_info = make_account_info(email="ada@example.com")
    repository = MockAccountRepository()
    monkeypatch.setattr(
        "apps.accounts.api.views.DjangoAccountRepository",
        lambda: repository,
    )

    client = APIClient()
    client.force_authenticate(user=account_info.account)

    response = client.get(
        "/api/accounts/user-info/",
        {"email": "missing@example.com"},
    )

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "code": "USER_NOT_FOUND",
            "message": "User was not found.",
        }
    }
