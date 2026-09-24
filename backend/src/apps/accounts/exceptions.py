class AccountError(Exception):
    code = "ACCOUNT_ERROR"
    message = "An account error occurred."

    def __init__(self) -> None:
        super().__init__(self.message)


class InvalidCredentialsError(AccountError):
    code = "INVALID_CREDENTIALS"
    message = "Invalid email or password."


class AccountDisabledError(AccountError):
    code = "ACCOUNT_DISABLED"
    message = "The account is disabled."


class UserInfoNotFoundError(AccountError):
    code = "USER_NOT_FOUND"
    message = "User was not found."


class AccountNotFoundError(AccountError):
    code = "ACCOUNT_NOT_FOUND"
    message = "Account was not found."
    

class AccountAlreadyExistsError(AccountError):
    code = "ACCOUNT_ALREADY_EXISTS"
    message = "An account with this email already exists."    
