from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from apps.accounts.application.dto import CreateAccountDTO, LoginDTO
from apps.accounts.application.selectors import (
    get_user_info_by_email,
    list_users,
)
from apps.accounts.application.services import create_account, login
from apps.accounts.infrastructure.repositories import DjangoAccountRepository
from apps.accounts.infrastructure.token_provider import SimpleJWTTokenProvider

from .serializers import (
    AccountCreatedResponseEnvelopeSerializer,
    AccountCreatedResponseSerializer,
    CreateAccountRequestSerializer,
    ErrorResponseSerializer,
    LoginRequestSerializer,
    LoginResponseEnvelopeSerializer,
    LoginResponseSerializer,
    UserInfoByEmailRequestSerializer,
    UserInfoResponseEnvelopeSerializer,
    UserInfoResponseSerializer,
    UserListResponseEnvelopeSerializer,
)


class AccountViewSet(ViewSet):
    @extend_schema(
        tags=["Accounts"],
        summary="Log in",
        auth=[],
        request=LoginRequestSerializer,
        responses={
            200: LoginResponseEnvelopeSerializer,
            401: OpenApiResponse(
                response=ErrorResponseSerializer,
                description="Invalid email or password.",
            ),
            403: OpenApiResponse(
                response=ErrorResponseSerializer,
                description="The account is disabled.",
            ),
        },
    )
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
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

    @extend_schema(
        tags=["Accounts"],
        summary="Get user info by email",
        parameters=[UserInfoByEmailRequestSerializer],
        responses={
            200: UserInfoResponseEnvelopeSerializer,
            404: OpenApiResponse(
                response=ErrorResponseSerializer,
                description="User was not found.",
            ),
        },
    )
    @action(
        detail=False,
        methods=["get"],
        url_path="user-info",
    )
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
        
    @extend_schema(
        tags=["Accounts"],
        summary="Register account",
        request=CreateAccountRequestSerializer,
        responses={
            201: AccountCreatedResponseEnvelopeSerializer,
            400: OpenApiResponse(
                response=ErrorResponseSerializer,
                description="An account with this email already exists.",
            ),
        },
    )
    @action(detail=False, methods=["post"])
    def register(self, request):
        request_serializer = CreateAccountRequestSerializer(
            data=request.data,
        )
        request_serializer.is_valid(raise_exception=True)

        data = request_serializer.validated_data

        dto = CreateAccountDTO(
            email=data["email"],
            password=data["password"],
            name=data["name"],
            last_name=data["last_name"],
            role=data["role"],
        )

        result = create_account(
            data=dto,
            repository=DjangoAccountRepository(),
        )

        response_serializer = AccountCreatedResponseSerializer(result)

        return Response(
            {
                "data": response_serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )
    
    @extend_schema(
        tags=["Accounts"],
        summary="List users",
        responses={
            200: UserListResponseEnvelopeSerializer,
        },
    )
    def list(self, request):
        result = list_users(
            repository=DjangoAccountRepository(),
        )

        response_serializer = UserInfoResponseSerializer(result, many=True)

        return Response(
            {
                "data": response_serializer.data,
            },
            status=status.HTTP_200_OK,
        )        
