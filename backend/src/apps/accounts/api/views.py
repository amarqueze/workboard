from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from apps.accounts.application.dto import LoginDTO
from apps.accounts.application.selectors import get_user_info_by_email
from apps.accounts.application.services import login
from apps.accounts.infrastructure.repositories import DjangoAccountRepository
from apps.accounts.infrastructure.token_provider import SimpleJWTTokenProvider

from .serializers import (
    LoginRequestSerializer,
    LoginResponseSerializer,
    UserInfoByEmailRequestSerializer,
    UserInfoResponseSerializer,
)


class AccountViewSet(ViewSet):
    @action(detail=False, methods=["post"])
    def login(self, request):
        request_serializer = LoginRequestSerializer(data=request.data)
        request_serializer.is_valid(raise_exception=True)

        data = request_serializer.validated_data

        dto = LoginDTO(
            email=data["email"],
            password=data["password"],
        )

        result = login(
            data=dto,
            repository=DjangoAccountRepository(),
            token_provider=SimpleJWTTokenProvider(),
        )

        response_serializer = LoginResponseSerializer(result)

        return Response(
            {
                "data": response_serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["get"], url_path="user-info")
    def user_info(self, request):
        request_serializer = UserInfoByEmailRequestSerializer(
            data=request.query_params,
        )
        request_serializer.is_valid(raise_exception=True)

        data = request_serializer.validated_data

        result = get_user_info_by_email(
            email=data["email"],
            repository=DjangoAccountRepository(),
        )

        response_serializer = UserInfoResponseSerializer(result)

        return Response(
            {
                "data": response_serializer.data,
            },
            status=status.HTTP_200_OK,
        )
