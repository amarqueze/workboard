from typing import Protocol

from apps.accounts.models import Account, AccountInfo

class AccountRepository(Protocol):
    def find_account_info_by_email(self, email: str) -> AccountInfo | None:
        ...

    def find_account_by_email(self, email: str) -> Account | None:
        ...

    def update_account_info(self, account_info: AccountInfo) -> None:
        ...

    def update_login_attempts(
        self,
        account: Account,
        attempts: int,
        *,
        is_active: bool | None = None,
    ) -> None:
        ...
        
class TokenProvider(Protocol):
    def generate_tokens(
        self,
        account: Account,
    ) -> tuple[str, str]:
        ...      