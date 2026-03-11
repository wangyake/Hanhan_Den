import { NavLink } from "react-router-dom";

function Ai() {
  return (
    <>
      <section className="grid">
        <div className="card">
          <div className="card-kicker">Story</div>
          <h2>生成你的冒险故事</h2>
          <p>选择主题，生成分支剧情，然后在浏览器里游玩。</p>
          <NavLink to="/adventure" className="card-cta">
            开始生成 →
          </NavLink>
        </div>

        <div className="card muted">
          <div className="card-kicker">Vision</div>
          <h2>图像识别</h2>
          <p>上传 → 推理 → 删除，不保存原图（后续实现）。</p>
          <div className="card-cta disabled" aria-disabled="true">
            Coming soon
          </div>
        </div>
      </section>
    </>
  );
}

export default Ai;

