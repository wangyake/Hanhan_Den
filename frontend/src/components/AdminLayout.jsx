import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminCommon.css';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h2>管理后台</h2>
        <ul>
          <li><Link to="/admin/articles">文章管理</Link></li>
          <li><Link to="/admin/galleries">图集管理</Link></li>
          <li><Link to="/admin/games">游戏管理</Link></li>
          <li><button onClick={handleLogout} className="logout-btn">退出登录</button></li>
        </ul>
      </div>
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;