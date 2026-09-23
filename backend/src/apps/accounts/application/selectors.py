from apps.accounts.application.interfaces import AccountRepository
from apps.accounts.exceptions import UserInfoNotFoundError
from apps.accounts.models import AccountInfo


def get_user_info_by_email(
    *,
    email: str,
    repository: AccountRepository,
) -> AccountInfo:
    account_info = repository.find_account_info_by_email(email)

    if account_info is None:
        raise UserInfoNotFoundError()

    return account_info
