from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.models import Account


class SimpleJWTTokenProvider:
    def generate_tokens(
        self,
        account: Account,
    ) -> tuple[str, str]:
        refresh = RefreshToken.for_user(account)

        return (
            str(refresh.access_token),
            str(refresh),
        )