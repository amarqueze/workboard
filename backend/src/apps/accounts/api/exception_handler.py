from rest_framework import status
from rest_framework.response import Response

from apps.accounts.exceptions import (
    AccountDisabledError,
    InvalidCredentialsError,
    UserInfoNotFoundError,
)


def handle_account_exception(exc: Exception) -> Response | None:
    if isinstance(exc, InvalidCredentialsError):
        return Response(
            {
                "error": {
                    "code": exc.code,
                    "message": exc.message,
                }
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if isinstance(exc, AccountDisabledError):
        return Response(
            {
                "error": {
                    "code": exc.code,
                    "message": exc.message,
                }
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    if isinstance(exc, UserInfoNotFoundError):
        return Response(
            {
                "error": {
                    "code": exc.code,
                    "message": exc.message,
                }
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    return None
