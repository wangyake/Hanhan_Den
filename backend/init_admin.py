#!/usr/bin/env python3
"""
初始化管理员用户
"""

from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

# 直接创建数据库引擎和会话工厂
DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 动态导入User模型
from models.user import User


def init_admin():
    """创建或更新管理员用户"""
    db = SessionLocal()
    try:
        # 导入密码哈希函数
        from core.auth import get_password_hash
        
        # 检查是否已存在管理员用户
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            # 创建管理员用户
            admin = User(
                username="admin",
                password_hash=get_password_hash("admin123")  # 密码: admin123
            )
            db.add(admin)
            db.commit()
            print("管理员用户创建成功！")
        else:
            # 更新管理员用户密码
            admin.password_hash = get_password_hash("admin123")
            db.commit()
            print("管理员用户密码更新成功！")
        
        print("用户名: admin")
        print("密码: admin123")
        print("请在生产环境中修改默认密码！")
    finally:
        db.close()


if __name__ == "__main__":
    # 确保表已创建
    from db.database import Base
    Base.metadata.create_all(bind=engine)
    init_admin()
