from dataclasses import dataclass

@dataclass(frozen=True, slots=True, kw_only=True)
class LoginDTO:
    email: str
    password: str
    
@dataclass(frozen=True, slots=True, kw_only=True)
class LoginResponseDTO:
    access_token: str
    refresh_token: str
    
@dataclass(frozen=True, slots=True, kw_only=True)
class CreateAccountDTO:
    email: str
    password: str
    name: str
    last_name: str
    role: str

@dataclass(frozen=True, slots=True, kw_only=True)
class AccountCreatedResponse:
    account_id: int
    username: str
    email: str
    name: str
    last_name: str
    role: str    