from rest_framework import status
from rest_framework.response import Response

from apps.taskmanager.exceptions import (
    InvalidTaskIdError,
    TaskNotFoundError,
    TaskStateNotFoundError,
)


def handle_taskmanager_exception(exc: Exception) -> Response | None:
    if isinstance(exc, InvalidTaskIdError):
        return Response(
            {
                "error": {
                    "code": exc.code,
                    "message": exc.message,
                }
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if isinstance(exc, TaskNotFoundError):
        return Response(
            {
                "error": {
                    "code": exc.code,
                    "message": exc.message,
                }
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    if isinstance(exc, TaskStateNotFoundError):
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
