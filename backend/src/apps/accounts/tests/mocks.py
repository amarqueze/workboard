from apps.accounts.application.dto import CreateAccountDTO
from apps.accounts.models import Account, AccountInfo


def make_account_info(
    *,
    account_id: int = 1,
    account_info_id: int = 1,
    email: str = "ada@example.com",
    username: str = "ada",
    password: str = "TestPass123!",
    name: str = "Ada",
    last_name: str = "Lovelace",
    role: str = "member",
    is_active: bool = True,
    login_attempts: int = 0,
) -> AccountInfo:
    account = Account(
        id=account_id,
        username=username,
        is_active=is_active,
        login_attempts=login_attempts,
    )
    account.set_password(password)

    return AccountInfo(
        id=account_info_id,
        account=account,
        email=email,
        name=name,
        last_name=last_name,
        role=role,
    )


class MockAccountRepository:
    def __init__(
        self,
        account_info_by_email: dict[str, AccountInfo] | None = None,
    ) -> None:
        self.account_info_by_email = account_info_by_email or {}
        self.created_account_info: list[AccountInfo] = []
        self.updated_login_attempts: list[tuple[Account, int, bool | None]] = []
        self.next_account_info_id = 1

    def find_account_info_by_email(self, email: str) -> AccountInfo | None:
        return self.account_info_by_email.get(email)

    def find_account_by_email(self, email: str) -> Account | None:
        account_info = self.find_account_info_by_email(email)

        if account_info is None:
            return None

        return account_info.account

    def update_account_info(self, account_info: AccountInfo) -> None:
        self.account_info_by_email[account_info.email] = account_info

    def update_login_attempts(
        self,
        account: Account,
        attempts: int,
        *,
        is_active: bool | None = None,
    ) -> None:
        account.login_attempts = attempts

        if is_active is not None:
            account.is_active = is_active

        self.updated_login_attempts.append((account, attempts, is_active))

    def create_account(
        self,
        username: str,
        data: CreateAccountDTO,
    ) -> AccountInfo:
        account_info = make_account_info(
            account_id=self.next_account_info_id,
            account_info_id=self.next_account_info_id,
            email=data.email,
            username=username,
            password=data.password,
            name=data.name,
            last_name=data.last_name,
            role=data.role,
        )
        self.next_account_info_id += 1
        self.account_info_by_email[data.email] = account_info
        self.created_account_info.append(account_info)

        return account_info


class MockTokenProvider:
    def __init__(
        self,
        access_token: str = "mock-access-token",
        refresh_token: str = "mock-refresh-token",
    ) -> None:
        self.access_token = access_token
        self.refresh_token = refresh_token
        self.accounts: list[Account] = []

    def generate_tokens(self, account: Account) -> tuple[str, str]:
        self.accounts.append(account)

        return self.access_token, self.refresh_token
