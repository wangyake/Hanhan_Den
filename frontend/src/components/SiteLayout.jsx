import { NavLink, Outlet } from "react-router-dom";

function SiteLayout() {
  return (
    <div className="site-page">
      <header className="site-header">
        <div className="site-header-inner" style={{ backgroundImage: 'url(https://picsum.photos/id/1067/1200/400)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="site-header-content">
            <div className="site-title">Welcome</div>
            <div className="site-subtitle">To strive, to seek, to find, and not to yield.</div>
          </div>
        </div>
      </header>

      <div className="site-body">
        <aside className="site-tabs" aria-label="Sections">
          <nav className="tabs">
            <NavLink to="/articles" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
              Articles
            </NavLink>
            <a className="tab disabled" aria-disabled="true">
              Gallery
              <span className="badge">soon</span>
            </a>
            <NavLink to="/games" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
              Mini Games
            </NavLink>
            <div className="tabs-spacer" />
            <NavLink to="/ai" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
              AI
            </NavLink>
          </nav>
        </aside>

        <main className="site-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default SiteLayout;

