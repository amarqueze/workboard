from apps.accounts.application.interfaces import AccountRepository
from apps.accounts.exceptions import UserInfoNotFoundError


def get_user_info_by_email(
    *,
    email: str,
    repository: AccountRepository,
) -> dict[str, int | str]:
    account_info = repository.find_account_info_by_email(email)

    if account_info is None:
        raise UserInfoNotFoundError()

    return {
        "account_id": account_info.id,
        "email": account_info.email,
        "name": account_info.name,
        "last_name": account_info.last_name,
        "role": account_info.role,
    }
