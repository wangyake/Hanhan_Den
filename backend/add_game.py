from db.database import SessionLocal, create_tables
from models.content import Game


def ensure_game(title: str, description: str) -> None:
    """
    如果数据库中不存在指定标题的游戏，则创建一条记录。
    """
    db = SessionLocal()
    try:
        existing = db.query(Game).filter(Game.title == title).first()

        if existing:
            print(f"游戏《{title}》已存在于数据库中（ID: {existing.id}）")
            return

        game = Game(
            title=title,
            description=description,
            is_hidden=False,
        )
        db.add(game)
        db.commit()
        db.refresh(game)
        print(f"游戏《{title}》已成功添加到数据库，ID: {game.id}")
    finally:
        db.close()


if __name__ == "__main__":
    # 确保表存在
    create_tables()

    # 扫雷游戏
    ensure_game(
        "扫雷游戏",
        "经典的扫雷游戏，支持不同难度级别，记录最高分",
    )

    # 打字游戏
    ensure_game(
        "打字游戏",
        "单词从天花板落下，在落到地面之前正确输入则爆炸消灭，支持多档速度和本地最高分记录",
    )