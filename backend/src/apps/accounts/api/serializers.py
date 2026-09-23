from rest_framework import serializers


class LoginRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )

class LoginResponseSerializer(serializers.Serializer):
    access_token = serializers.CharField()
    refresh_token = serializers.CharField()

class LoginResponseEnvelopeSerializer(serializers.Serializer):
    data = LoginResponseSerializer()

class UserInfoByEmailRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class UserInfoResponseSerializer(serializers.Serializer):
    account_id = serializers.IntegerField()
    email = serializers.EmailField()
    name = serializers.CharField()
    last_name = serializers.CharField()
    role = serializers.CharField()

class UserInfoResponseEnvelopeSerializer(serializers.Serializer):
    data = UserInfoResponseSerializer()

class CreateAccountRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )
    name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    role = serializers.CharField(max_length=50)

class AccountCreatedResponseSerializer(serializers.Serializer):
    account_id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.EmailField()
    name = serializers.CharField()
    last_name = serializers.CharField()
    role = serializers.CharField()

class AccountCreatedResponseEnvelopeSerializer(serializers.Serializer):
    data = AccountCreatedResponseSerializer()

class ErrorDetailSerializer(serializers.Serializer):
    code = serializers.CharField()
    message = serializers.CharField()

class ErrorResponseSerializer(serializers.Serializer):
    error = ErrorDetailSerializer()
