import logging

from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler

from apps.accounts.api.exception_handler import handle_account_exception
from apps.taskmanager.api.exception_handler import handle_taskmanager_exception

logger = logging.getLogger(__name__)


def api_exception_handler(exc: Exception, context: dict) -> Response:
    if isinstance(exc, ValidationError):
        return Response(
            {
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Invalid request data.",
                    "details": exc.detail,
                }
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    account_response = handle_account_exception(exc)

    if account_response is not None:
        return account_response

    taskmanager_response = handle_taskmanager_exception(exc)

    if taskmanager_response is not None:
        return taskmanager_response

    drf_response = drf_exception_handler(exc, context)

    if drf_response is not None:
        return Response(
            {
                "error": {
                    "code": "REQUEST_ERROR",
                    "message": "The request could not be processed.",
                    "details": drf_response.data,
                }
            },
            status=drf_response.status_code,
        )

    logger.exception(
        "Unhandled exception",
        exc_info=exc,
    )

    return Response(
        {
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred.",
            }
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
