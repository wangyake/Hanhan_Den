function Articles() {
  return (
    <>
      <section className="list">
        <div className="list-item">
          <div className="list-image">
            <img src="https://picsum.photos/id/1/400/200" alt="Article 1" />
          </div>
          <div className="list-content">
            <div className="list-title">第一篇文章（示例）</div>
            <div className="list-excerpt">这里会显示前几行摘要……</div>
          </div>
        </div>
        <div className="list-item">
          <div className="list-image">
            <img src="https://picsum.photos/id/2/400/200" alt="Article 2" />
          </div>
          <div className="list-content">
            <div className="list-title">第二篇文章（示例）</div>
            <div className="list-excerpt">这里会显示前几行摘要……</div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Articles;

