from pydantic import BaseModel, Field
from datetime import datetime

class ArticleBase(BaseModel):
    title: str
    content: str
    is_hidden: bool = False

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    is_hidden: bool | None = None

class ArticleResponse(ArticleBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class GalleryBase(BaseModel):
    title: str
    image_url: str
    is_hidden: bool = False

class GalleryCreate(GalleryBase):
    pass

class GalleryUpdate(BaseModel):
    title: str | None = None
    image_url: str | None = None
    is_hidden: bool | None = None

class GalleryResponse(GalleryBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class GameBase(BaseModel):
    title: str
    description: str
    is_hidden: bool = False

class GameCreate(GameBase):
    pass

class GameUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    is_hidden: bool | None = None

class GameResponse(GameBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
