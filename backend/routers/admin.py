from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db.database import get_db
from core.auth import get_current_user
from models.user import User
from models.content import Article, Gallery, Game
from schemas.content import (
    ArticleCreate, ArticleUpdate, ArticleResponse,
    GalleryCreate, GalleryUpdate, GalleryResponse,
    GameCreate, GameUpdate, GameResponse
)

router = APIRouter()

# 文章管理

# 获取文章列表
@router.get("/articles", response_model=list[ArticleResponse])
def get_articles(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    articles = db.query(Article).offset(skip).limit(limit).all()
    return articles

# 获取单个文章
@router.get("/articles/{article_id}", response_model=ArticleResponse)
def get_article(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    return article

# 创建文章
@router.post("/articles", response_model=ArticleResponse)
def create_article(
    article: ArticleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_article = Article(**article.dict())
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

# 更新文章
@router.put("/articles/{article_id}", response_model=ArticleResponse)
def update_article(
    article_id: int,
    article: ArticleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if not db_article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    update_data = article.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_article, key, value)
    
    db.commit()
    db.refresh(db_article)
    return db_article

# 删除文章
@router.delete("/articles/{article_id}")
def delete_article(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if not db_article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    db.delete(db_article)
    db.commit()
    return {"message": "Article deleted successfully"}

# 图集管理

# 获取图集列表
@router.get("/galleries", response_model=list[GalleryResponse])
def get_galleries(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    galleries = db.query(Gallery).offset(skip).limit(limit).all()
    return galleries

# 获取单个图片
@router.get("/galleries/{gallery_id}", response_model=GalleryResponse)
def get_gallery(
    gallery_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    gallery = db.query(Gallery).filter(Gallery.id == gallery_id).first()
    if not gallery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gallery not found"
        )
    return gallery

# 创建图片
@router.post("/galleries", response_model=GalleryResponse)
def create_gallery(
    gallery: GalleryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_gallery = Gallery(**gallery.dict())
    db.add(db_gallery)
    db.commit()
    db.refresh(db_gallery)
    return db_gallery

# 更新图片
@router.put("/galleries/{gallery_id}", response_model=GalleryResponse)
def update_gallery(
    gallery_id: int,
    gallery: GalleryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_gallery = db.query(Gallery).filter(Gallery.id == gallery_id).first()
    if not db_gallery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gallery not found"
        )
    
    update_data = gallery.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_gallery, key, value)
    
    db.commit()
    db.refresh(db_gallery)
    return db_gallery

# 删除图片
@router.delete("/galleries/{gallery_id}")
def delete_gallery(
    gallery_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_gallery = db.query(Gallery).filter(Gallery.id == gallery_id).first()
    if not db_gallery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gallery not found"
        )
    
    db.delete(db_gallery)
    db.commit()
    return {"message": "Gallery deleted successfully"}

# 游戏管理

# 获取游戏列表（需要认证）
@router.get("/games", response_model=list[GameResponse])
def get_games(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    games = db.query(Game).offset(skip).limit(limit).all()
    return games

# 获取游戏列表（不需要认证，用于前端展示）
@router.get("/games/public", response_model=list[GameResponse])
def get_public_games(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    # 只返回未隐藏的游戏
    games = db.query(Game).filter(Game.is_hidden == False).offset(skip).limit(limit).all()
    return games

# 更新游戏（用于切换隐藏状态）
@router.put("/games/{game_id}", response_model=GameResponse)
def update_game(
    game_id: int,
    game: GameUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_game = db.query(Game).filter(Game.id == game_id).first()
    if not db_game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found"
        )
    
    update_data = game.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_game, key, value)
    
    db.commit()
    db.refresh(db_game)
    return db_game
