from apps.accounts.application.interfaces import AccountRepository
from apps.accounts.exceptions import UserInfoNotFoundError
from apps.accounts.models import AccountInfo

def list_users(
    *,
    repository: AccountRepository,
) -> list[dict[str, int | str]]:
    account_info_list = repository.list_account_info()

    return [
        _account_info_to_dict(account_info)
        for account_info in account_info_list
    ]

def get_user_info_by_email(
    *,
    email: str,
    repository: AccountRepository,
) -> dict[str, int | str]:
    account_info = repository.find_account_info_by_email(email)

    if account_info is None:
        raise UserInfoNotFoundError()

    return _account_info_to_dict(account_info)
    
def _account_info_to_dict(account_info: AccountInfo) -> dict[str, int | str]:
    return {
        "account_id": account_info.id,
        "email": account_info.email,
        "name": account_info.name,
        "last_name": account_info.last_name,
        "role": account_info.role,
    }
    