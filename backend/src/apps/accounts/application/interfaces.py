from typing import Protocol

from apps.accounts.application.dto import CreateAccountDTO
from apps.accounts.models import Account, AccountInfo


class AccountRepository(Protocol):
    def list_account_info(self) -> list[AccountInfo]:
        ...

    def find_account_info_by_email(self, email: str) -> AccountInfo | None:
        ...

    def find_account_info_by_id(
        self,
        account_info_id: int,
    ) -> AccountInfo | None:
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
    
    def create_account(
        self,
        username: str,
        data: CreateAccountDTO,
    ) -> AccountInfo:
        ...    
                
class TokenProvider(Protocol):
    def generate_tokens(
        self,
        account: Account,
    ) -> tuple[str, str]:
        ...      
