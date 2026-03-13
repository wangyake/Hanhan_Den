Hanhan's Den
============

### 项目简介

**Hanhan's Den** 是一个个人网站 / 小站，用来展示和管理故事内容、游戏、文章等创作内容，并提供简单的后台管理和 AI 相关能力。项目采用前后端分离架构，后端提供统一的 REST API，前端负责页面展示与交互。

### 项目结构（精简版）

- **后端 `backend/`**
  - 入口：`main.py`（创建 FastAPI 应用、挂载路由、启动 Uvicorn）
  - 配置：`core/config.py`（API 前缀、CORS、环境变量等）
  - 路由：`routers/`（`story.py`、`job.py`、`auth.py`、`admin.py` 等业务入口）
  - 数据库：`db/database.py`（连接与建表）、`database.db`（示例数据文件）
  - 依赖与包：`pyproject.toml`、`.env.example`

- **前端 `frontend/`**
  - 入口：`src/main.jsx`（挂载 React 应用）、`src/App.jsx`（前端路由与布局）
  - 主要页面与组件：`src/components/`（站点页面、后台管理、故事生成、游戏等）
  - 静态资源：`public/`（包含小游戏 `public/games/`）
  - 构建与工具配置：`vite.config.js`、`eslint.config.js`、`package.json`

### 技术栈

- **后端**
  - **框架**：FastAPI
  - **运行环境**: Python ≥ 3.9
  - **主要依赖**（见 `backend/pyproject.toml`）
    - `fastapi[all]`：Web 框架与文档（Swagger / ReDoc）。
    - `uvicorn`：ASGI 服务器。
    - `sqlalchemy`：ORM 与数据库访问。
    - `psycopg2-binary`：PostgreSQL 驱动（也可以接入其他数据库，当前仓库附带 `database.db` 作为示例）。
    - `python-dotenv`、`pydantic-settings`：配置与环境变量管理。
    - `python-jose[cryptography]`、`passlib[bcrypt]`、`python-multipart`：鉴权、密码哈希与表单支持。
    - `langchain`、`langchain-openai`：AI / LLM 相关能力封装。

- **前端**
  - **框架**：React 19 + React Router
  - **构建工具**：Vite
  - **语言**：JavaScript (ESM)
  - **主要依赖**
    - `react`、`react-dom`
    - `react-router-dom`
    - `axios`：与后端 API 通信。

### 启动方式（本地开发）

> 以下命令假设你已在项目根目录 `Hanhan_Den` 下。

- **后端**
  1. 准备 Python 环境（建议使用虚拟环境，Python ≥ 3.9）。
  2. 安装依赖：
     ```bash
     cd backend
     pip install -e .
     # 或使用 PDM/UV/其他 PEP 621 工具，请根据个人习惯调整
     ```
  3. 配置环境变量（参考 `backend/.env.example`）。
  4. 启动服务：
     ```bash
     python main.py
     ```
     默认会通过 Uvicorn 启动 FastAPI，监听在 `http://127.0.0.1:8000`，接口文档：
     - Swagger UI: `http://127.0.0.1:8000/docs`
     - ReDoc: `http://127.0.0.1:8000/redoc`

- **前端**
  1. 确保已安装 Node.js（建议 18+）。
  2. 安装依赖：
     ```bash
     cd frontend
     npm install
     ```
  3. 启动开发服务器：
     ```bash
     npm run dev
     ```
     通常会在 `http://127.0.0.1:5173` 提供前端页面。

### 约定与说明

- 默认前端会调用后端提供的 `Hanhan's Den API`，请根据实际部署情况在前端配置中调整 API 基础地址。
- 数据库配置、OpenAI / LLM 相关密钥等敏感信息应放入 `.env` 文件中，不要提交到版本库。
- 若需要扩展新的内容类型（如新的故事类型、新的游戏模块），推荐：
  - 在后端新增对应的 `models/`、`schemas/`、`routers/`。
  - 在前端新增相应的展示组件与路由，并接入统一布局。

如需再补充「创作理念」、中英文双语版本或部署说明，我也可以继续帮你完善。
