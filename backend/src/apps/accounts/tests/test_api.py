import pytest
from rest_framework.test import APIClient

from apps.accounts.models import Account, AccountInfo

pytestmark = pytest.mark.django_db


def test_user_info_endpoint_returns_user_info_by_email() -> None:
    account = Account.objects.create_user(
        username="ada",
        password="TestPass123!",
    )
    AccountInfo.objects.create(
        account=account,
        email="ada@example.com",
        name="Ada",
        last_name="Lovelace",
        role="member",
    )

    client = APIClient()

    response = client.get(
        "/api/accounts/user-info/",
        {"email": "ada@example.com"},
    )

    assert response.status_code == 200
    assert response.json() == {
        "data": {
            "id": account.info.id,
            "email": "ada@example.com",
            "name": "Ada",
            "last_name": "Lovelace",
            "role": "member",
        }
    }


def test_user_info_endpoint_returns_not_found_when_user_info_does_not_exist() -> None:
    client = APIClient()

    response = client.get(
        "/api/accounts/user-info/",
        {"email": "missing@example.com"},
    )

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "code": "USER_INFO_NOT_FOUND",
            "message": "User info was not found.",
        }
    }
