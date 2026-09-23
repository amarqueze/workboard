import pytest
from rest_framework.test import APIClient

from apps.accounts.application.selectors import list_users

from .mocks import MockAccountRepository, make_account_info


# Tests that the selector returns all users from the repository.
def test_list_users_returns_user_dictionaries() -> None:
    ada_info = make_account_info(
        account_id=1,
        account_info_id=1,
        email="ada@example.com",
        username="ada",
        name="Ada",
        last_name="Lovelace",
        role="member",
    )
    grace_info = make_account_info(
        account_id=2,
        account_info_id=2,
        email="grace@example.com",
        username="grace",
        name="Grace",
        last_name="Hopper",
        role="admin",
    )
    repository = MockAccountRepository(
        account_info_by_email={
            "ada@example.com": ada_info,
            "grace@example.com": grace_info,
        },
    )

    result = list_users(repository=repository)

    assert result == [
        {
            "account_id": 1,
            "email": "ada@example.com",
            "name": "Ada",
            "last_name": "Lovelace",
            "role": "member",
        },
        {
            "account_id": 2,
            "email": "grace@example.com",
            "name": "Grace",
            "last_name": "Hopper",
            "role": "admin",
        },
    ]


# Tests that an authenticated client can list all users.
def test_accounts_list_endpoint_returns_all_users(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    ada_info = make_account_info(
        account_id=1,
        account_info_id=1,
        email="ada@example.com",
        username="ada",
        name="Ada",
        last_name="Lovelace",
        role="member",
    )
    grace_info = make_account_info(
        account_id=2,
        account_info_id=2,
        email="grace@example.com",
        username="grace",
        name="Grace",
        last_name="Hopper",
        role="admin",
    )
    repository = MockAccountRepository(
        account_info_by_email={
            "ada@example.com": ada_info,
            "grace@example.com": grace_info,
        },
    )
    monkeypatch.setattr(
        "apps.accounts.api.views.DjangoAccountRepository",
        lambda: repository,
    )

    client = APIClient()
    client.force_authenticate(user=ada_info.account)

    response = client.get("/api/accounts/")

    assert response.status_code == 200
    assert response.json() == {
        "data": [
            {
                "account_id": 1,
                "email": "ada@example.com",
                "name": "Ada",
                "last_name": "Lovelace",
                "role": "member",
            },
            {
                "account_id": 2,
                "email": "grace@example.com",
                "name": "Grace",
                "last_name": "Hopper",
                "role": "admin",
            },
        ]
    }
