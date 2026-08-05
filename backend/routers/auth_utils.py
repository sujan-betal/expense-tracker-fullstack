from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
import os


SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY missing")


ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12
)


def hash_password(password: str) -> str:
    return pwd_context.hash(
        password.encode("utf-8")[:72]
    )


def verify_password(
    plain: str,
    hashed: str
) -> bool:
    try:
        return pwd_context.verify(
            plain.encode("utf-8")[:72],
            hashed
        )
    except Exception:
        return False



def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
):

    payload = data.copy()

    expire = datetime.now(timezone.utc) + (
        expires_delta 
        or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    payload.update({
        "exp": expire
    })

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )



def decode_token(token: str):

    try:
        return jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

    except JWTError:
        return None