import pytest
from rest_framework.test import APIClient

from apps.accounts.application.dto import LoginDTO
from apps.accounts.application.services import MAX_LOGIN_ATTEMPTS, login
from apps.accounts.exceptions import AccountDisabledError, InvalidCredentialsError

from .mocks import MockAccountRepository, MockTokenProvider, make_account_info

pytestmark = pytest.mark.django_db


# Tests that the public login endpoint returns mocked tokens for valid credentials.
def test_login_endpoint_returns_tokens_for_valid_credentials(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    account_info = make_account_info(
        email="ada@example.com",
        password="TestPass123!",
        login_attempts=2,
    )
    repository = MockAccountRepository(
        account_info_by_email={
            "ada@example.com": account_info,
        },
    )
    token_provider = MockTokenProvider()
    monkeypatch.setattr(
        "apps.accounts.api.views.DjangoAccountRepository",
        lambda: repository,
    )
    monkeypatch.setattr(
        "apps.accounts.api.views.SimpleJWTTokenProvider",
        lambda: token_provider,
    )

    client = APIClient()

    response = client.post(
        "/api/accounts/login/",
        {
            "email": "ada@example.com",
            "password": "TestPass123!",
        },
    )

    assert response.status_code == 200
    assert response.json() == {
        "data": {
            "access_token": "mock-access-token",
            "refresh_token": "mock-refresh-token",
        }
    }
    assert token_provider.accounts == [account_info.account]


# Tests that login rejects a valid email with an invalid password.
def test_login_endpoint_returns_unauthorized_for_invalid_credentials(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    account_info = make_account_info(
        email="ada@example.com",
        password="TestPass123!",
    )
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

    response = client.post(
        "/api/accounts/login/",
        {
            "email": "ada@example.com",
            "password": "WrongPass123!",
        },
    )

    assert response.status_code == 401
    assert response.json() == {
        "error": {
            "code": "INVALID_CREDENTIALS",
            "message": "Invalid email or password.",
        }
    }
    assert repository.updated_login_attempts == [
        (account_info.account, 1, None),
    ]


# Tests that login rejects an inactive account without updating login attempts.
def test_login_endpoint_returns_forbidden_when_account_is_inactive(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    account_info = make_account_info(
        email="ada@example.com",
        password="TestPass123!",
        is_active=False,
    )
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

    response = client.post(
        "/api/accounts/login/",
        {
            "email": "ada@example.com",
            "password": "TestPass123!",
        },
    )

    assert response.status_code == 403
    assert response.json() == {
        "error": {
            "code": "ACCOUNT_DISABLED",
            "message": "The account is disabled.",
        }
    }
    assert repository.updated_login_attempts == []


# Tests that login disables the account when the max failed attempts is reached.
def test_login_endpoint_disables_account_when_max_login_attempts_is_reached(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    account_info = make_account_info(
        email="ada@example.com",
        password="TestPass123!",
        login_attempts=MAX_LOGIN_ATTEMPTS - 1,
    )
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

    response = client.post(
        "/api/accounts/login/",
        {
            "email": "ada@example.com",
            "password": "WrongPass123!",
        },
    )

    assert response.status_code == 403
    assert response.json() == {
        "error": {
            "code": "ACCOUNT_DISABLED",
            "message": "The account is disabled.",
        }
    }
    assert account_info.account.is_active is False
    assert repository.updated_login_attempts == [
        (account_info.account, MAX_LOGIN_ATTEMPTS, False),
    ]


# Tests that the login service rejects an inactive account.
def test_login_service_raises_when_account_is_inactive() -> None:
    account_info = make_account_info(
        email="ada@example.com",
        password="TestPass123!",
        is_active=False,
    )
    repository = MockAccountRepository(
        account_info_by_email={
            "ada@example.com": account_info,
        },
    )
    token_provider = MockTokenProvider()

    with pytest.raises(AccountDisabledError):
        login(
            data=LoginDTO(
                email="ada@example.com",
                password="TestPass123!",
            ),
            repository=repository,
            token_provider=token_provider,
        )

    assert repository.updated_login_attempts == []
    assert token_provider.accounts == []


# Tests that the login service disables the account at the max failed attempts.
def test_login_service_disables_account_when_max_login_attempts_is_reached() -> None:
    account_info = make_account_info(
        email="ada@example.com",
        password="TestPass123!",
        login_attempts=MAX_LOGIN_ATTEMPTS - 1,
    )
    repository = MockAccountRepository(
        account_info_by_email={
            "ada@example.com": account_info,
        },
    )
    token_provider = MockTokenProvider()

    with pytest.raises(AccountDisabledError):
        login(
            data=LoginDTO(
                email="ada@example.com",
                password="WrongPass123!",
            ),
            repository=repository,
            token_provider=token_provider,
        )

    assert account_info.account.is_active is False
    assert repository.updated_login_attempts == [
        (account_info.account, MAX_LOGIN_ATTEMPTS, False),
    ]
    assert token_provider.accounts == []


# Tests that the login service rejects an email without an account.
def test_login_service_raises_when_account_does_not_exist() -> None:
    repository = MockAccountRepository()
    token_provider = MockTokenProvider()

    with pytest.raises(InvalidCredentialsError):
        login(
            data=LoginDTO(
                email="missing@example.com",
                password="TestPass123!",
            ),
            repository=repository,
            token_provider=token_provider,
        )

    assert repository.updated_login_attempts == []
    assert token_provider.accounts == []
