from dataclasses import dataclass

@dataclass(frozen=True, slots=True, kw_only=True)
class LoginDTO:
    email: str
    password: str
    
@dataclass(frozen=True, slots=True, kw_only=True)
class LoginResponseDTO:
    access_token: str
    refresh_token: str