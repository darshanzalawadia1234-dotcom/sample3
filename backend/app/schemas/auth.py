from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserSignUpRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="User password (at least 6 characters)")
    full_name: Optional[str] = "Polar Expedition Operator"
    organization: Optional[str] = "Antarctic Research Institute"
    role: Optional[str] = "operator"

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserProfileResponse(BaseModel):
    id: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    organization: Optional[str] = None
    role: Optional[str] = "operator"

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfileResponse
    message: Optional[str] = "Authentication successful"
