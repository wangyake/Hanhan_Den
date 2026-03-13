import uuid 
from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Cookie, Response, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import func

from db.database import get_db, SessionLocal
from models.story import Story, StoryNode
from models.job import StoryJob
from schemas.story import (
    CompleteStoryResponse, CompleteStoryNodeResponse, CreateStoryRequest
)
from schemas.job import StoryJobResponse
from core.story_generator import StoryGenerator

router = APIRouter(
    prefix = "/stories",
    tags = ["stories"]
)

def get_session_id(session_id: Optional[str] = Cookie(None)):
    if session_id is None:
        session_id = str(uuid.uuid4())
    return session_id

@router.post("/create", response_model=StoryJobResponse)
def create_story(
    request: CreateStoryRequest,
    background_tasks: BackgroundTasks, # once the job is done, BackgroundTasks goes to LLM to generate a story
    response: Response,
    session_id: str = Depends(get_session_id),
    db: Session = Depends(get_db)
):
    # httponly:禁止JS脚本通过document.cookie 读取或修改。仅由浏览器在HTTP请求时自动携带到客户端。有效防范XSS攻击窃取session id。
    response.set_cookie(key = "session_id", value=session_id, httponly=True)

    job_id = str(uuid.uuid4())

    # 检查是否已经有相同主题的故事存在
    # 直接查询 "勺子杀手" 主题的故事
    if request.theme == "勺子杀手":
        existing_jobs = db.query(StoryJob).filter(
            StoryJob.theme == "勺子杀手",
            StoryJob.status == "completed",
            StoryJob.story_id.isnot(None)
        ).all()
    else:
        # 使用不区分大小写的匹配，并且允许主题前后有空格
        existing_jobs = db.query(StoryJob).filter(
            func.lower(func.trim(StoryJob.theme)) == func.lower(func.trim(request.theme)),
            StoryJob.status == "completed",
            StoryJob.story_id.isnot(None)
        ).all()
    
    # 如果有3个或以上相同主题的故事，随机选择一个
    if len(existing_jobs) >= 3:
        import random
        selected_job = random.choice(existing_jobs)
        existing_story = db.query(Story).filter(Story.id == selected_job.story_id).first()
        if existing_story:
            # 直接创建一个已完成的任务
            job = StoryJob(
                job_id = job_id,
                session_id = session_id,
                theme = request.theme,
                status = "completed",
                story_id = existing_story.id,
                completed_at = datetime.now()
            )  
            db.add(job)
            db.commit()
            return job
    # 如果少于3个相同主题的故事，创建新任务生成故事

    # 如果没有已存在的故事，创建一个新任务
    job = StoryJob(
        job_id = job_id,
        session_id = session_id,
        theme = request.theme,
        status = "pending"
    )  
    db.add(job)
    db.commit()

    # TODO
    background_tasks.add_task(
        generate_story_task,
        job_id = job_id,
        theme = request.theme,
        session_id = session_id
    )

    return job

def generate_story_task(job_id: str, theme: str, session_id: str):
    db = SessionLocal()
    try:
        job = db.query(StoryJob).filter(StoryJob.job_id == job_id).first()
        if not job:
            return 
        try:
            job.status = "processing"
            db.commit()

            # 直接生成新故事，因为已经在create_story函数中检查过了
            story = StoryGenerator.generate_story(db, session_id, theme)

            job.story_id = story.id
            job.status = "completed"
            job.completed_at = datetime.now()
            db.commit()
        except Exception as e:
            job.status = "failed"
            job.completed_at = datetime.now()
            job.error = str(e)
            db.commit()
    finally:
        db.close()


@router.get("/{story_id}/complete", response_model = CompleteStoryResponse)
def get_complete_story(story_id: int, db: Session = Depends(get_db)):
    story = db.query(Story).filter(Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    complete_story = build_complete_story_tree(db, story)
    return complete_story


def build_complete_story_tree(db: Session, story: Story) -> CompleteStoryResponse:
    nodes = db.query(StoryNode).filter(StoryNode.story_id == story.id).all()
    node_dict = {}
    for node in nodes:
        node_response = CompleteStoryNodeResponse(
            id = node.id,
            content = node.content,
            is_ending = node.is_ending,
            is_winning_ending = node.is_winning_ending,
            options = node.options
        )
        node_dict[node.id] = node_response
    
    root_node = next((node for node in nodes if node.is_root), None)
    if not root_node:
        raise HTTPException(status_code=500, detail = "Story root node not found")
    
    return CompleteStoryResponse(
        id = story.id,
        title = story.title,
        session_id = story.session_id,
        created_at = story.create_at,
        root_node = node_dict[root_node.id],
        all_nodes = node_dict
    )


