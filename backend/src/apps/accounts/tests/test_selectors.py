import pytest

from apps.accounts.application.selectors import get_user_info_by_email
from apps.accounts.exceptions import UserInfoNotFoundError
from apps.accounts.infrastructure.repositories import DjangoAccountRepository
from apps.accounts.models import Account, AccountInfo

pytestmark = pytest.mark.django_db


def test_get_user_info_by_email_returns_account_info() -> None:
    account = Account.objects.create_user(
        username="ada",
        password="TestPass123!",
    )
    account_info = AccountInfo.objects.create(
        account=account,
        email="ada@example.com",
        name="Ada",
        last_name="Lovelace",
        role="member",
    )

    result = get_user_info_by_email(
        email="ada@example.com",
        repository=DjangoAccountRepository(),
    )

    assert result == account_info


def test_get_user_info_by_email_raises_when_user_info_does_not_exist() -> None:
    with pytest.raises(UserInfoNotFoundError):
        get_user_info_by_email(
            email="missing@example.com",
            repository=DjangoAccountRepository(),
        )
