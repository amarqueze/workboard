from apps.accounts.models import Account, AccountInfo

class DjangoAccountRepository:
    def find_account_info_by_email(
        self,
        email: str,
    ) -> AccountInfo | None:
        try:
            return AccountInfo.objects.select_related("account").get(
                email=email,
            )
        except AccountInfo.DoesNotExist:
            return None

    def find_account_by_email(
        self,
        email: str,
    ) -> Account | None:
        account_info = self.find_account_info_by_email(email)

        if account_info is None:
            return None

        return account_info.account

    def update_account_info(
        self,
        account_info: AccountInfo,
    ) -> None:
        account_info.save()

    def update_login_attempts(
        self,
        account: Account,
        attempts: int,
        *,
        is_active: bool | None = None,
    ) -> None:
        account.login_attempts = attempts

        update_fields = ["login_attempts"]

        if is_active is not None:
            account.is_active = is_active
            update_fields.append("is_active")

        account.save(update_fields=update_fields)