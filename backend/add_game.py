from db.database import SessionLocal, create_tables
from models.content import Game

# 创建表
create_tables()

# 创建数据库会话
db = SessionLocal()

try:
    # 检查是否已存在扫雷游戏
    existing_game = db.query(Game).filter(Game.title == "扫雷游戏").first()
    
    if not existing_game:
        # 创建扫雷游戏记录
        minesweeper_game = Game(
            title="扫雷游戏",
            description="经典的扫雷游戏，支持不同难度级别，记录最高分",
            is_hidden=False
        )
        
        db.add(minesweeper_game)
        db.commit()
        db.refresh(minesweeper_game)
        
        print(f"扫雷游戏已成功添加到数据库，ID: {minesweeper_game.id}")
    else:
        print("扫雷游戏已存在于数据库中")
finally:
    db.close()