from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db.database import get_db
from core.auth import verify_password, create_access_token, get_current_user
from core.config import settings
from models.user import User
from schemas.user import UserResponse

router = APIRouter()

# 登录请求模型
class LoginRequest(BaseModel):
    username: str
    password: str

# 登录（支持表单和JSON格式）
@router.post("/login", response_model=dict)
async def login(
    request: Request,
    db: Session = Depends(get_db)
):
    # 检查是否是JSON请求
    content_type = request.headers.get('Content-Type')
    if content_type and 'application/json' in content_type:
        # 解析JSON请求
        login_data = await request.json()
        username = login_data.get('username')
        password = login_data.get('password')
    else:
        # 解析表单数据
        form_data = await request.form()
        username = form_data.get('username')
        password = form_data.get('password')
    
    # 验证参数
    if not username or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username and password are required"
        )
    
    # 限制密码长度，bcrypt最多支持72字节
    if len(password) > 72:
        password = password[:72]
    
    # 查找用户
    user = db.query(User).filter(User.username == username).first()
    
    # 验证用户和密码
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 生成访问令牌
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# 登录（支持OAuth2密码流）
@router.post("/login/form", response_model=dict)
def login_form(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # 查找用户
    user = db.query(User).filter(User.username == form_data.username).first()
    
    # 限制密码长度，bcrypt最多支持72字节
    password = form_data.password
    if len(password) > 72:
        password = password[:72]
    
    # 验证用户和密码
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 生成访问令牌
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# 获取当前用户信息
@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
