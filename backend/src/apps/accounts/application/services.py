from django.db import transaction

from apps.accounts.application.dto import (
    AccountCreatedResponse,
    CreateAccountDTO,
    LoginDTO,
    LoginResponseDTO,
)
from apps.accounts.application.interfaces import (
    AccountRepository,
    TokenProvider,
)
from apps.accounts.exceptions import (
    AccountAlreadyExistsError,
    AccountDisabledError,
    InvalidCredentialsError,
)
from apps.accounts.models import Account, AccountInfo

MAX_LOGIN_ATTEMPTS = 3

@transaction.atomic
def login(
    *,
    data: LoginDTO,
    repository: AccountRepository,
    token_provider: TokenProvider,
) -> LoginResponseDTO:
    account = repository.find_account_by_email(data.email)

    if account is None:
        raise InvalidCredentialsError()

    if not account.is_active:
        raise AccountDisabledError()

    if not account.check_password(data.password):
        attempts = account.login_attempts + 1

        if attempts >= MAX_LOGIN_ATTEMPTS:
            repository.update_login_attempts(
                account,
                attempts,
                is_active=False,
            )

            raise AccountDisabledError()

        repository.update_login_attempts(
            account,
            attempts,
        )

        raise InvalidCredentialsError()

    if account.login_attempts > 0:
        repository.update_login_attempts(
            account,
            0,
        )

    access_token, refresh_token = token_provider.generate_tokens(
        account
    )

    return LoginResponseDTO(
        access_token=access_token,
        refresh_token=refresh_token,
    )
    
    
@transaction.atomic
def create_account(
    *,
    data: CreateAccountDTO,
    repository: AccountRepository,
) -> AccountCreatedResponse:
    existing_account = repository.find_account_by_email(data.email)
    if existing_account is not None:
        raise AccountAlreadyExistsError()

    username = data.email.split("@", maxsplit=1)[0]
    account_info = repository.create_account(username, data)

    return AccountCreatedResponse(
        account_id=account_info.id,
        username=account_info.account.username,
        email=account_info.email,
        name=account_info.name,
        last_name=account_info.last_name,
        role=account_info.role,
    )