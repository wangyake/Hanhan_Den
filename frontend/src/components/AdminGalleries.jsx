import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminCommon.css';

const AdminGalleries = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGallery, setNewGallery] = useState({
    title: '',
    image_url: '',
    is_hidden: false,
  });
  const navigate = useNavigate();

  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const response = await fetch('http://localhost:8000/api/admin/galleries', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('获取图集失败');
      }

      const data = await response.json();
      setGalleries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const handleAddGallery = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/admin/galleries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newGallery),
      });

      if (!response.ok) {
        throw new Error('创建图集失败');
      }

      setShowAddForm(false);
      setNewGallery({ title: '', image_url: '', is_hidden: false });
      fetchGalleries();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateGallery = async (id, updatedGallery) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/admin/galleries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedGallery),
      });

      if (!response.ok) {
        throw new Error('更新图集失败');
      }

      fetchGalleries();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteGallery = async (id) => {
    if (!confirm('确定要删除这个图集吗？')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/admin/galleries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('删除图集失败');
      }

      fetchGalleries();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="list-container">
      <h1>图集管理</h1>
      {error && <div className="error-message">{error}</div>}
      
      <button 
        className="add-btn"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? '取消' : '添加图集'}
      </button>

      {showAddForm && (
        <form onSubmit={handleAddGallery} className="card">
          <h2>添加图集</h2>
          <div className="form-group">
            <label>标题</label>
            <input
              type="text"
              value={newGallery.title}
              onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>图片URL</label>
            <input
              type="url"
              value={newGallery.image_url}
              onChange={(e) => setNewGallery({ ...newGallery, image_url: e.target.value })}
              required
            />
          </div>
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="is_hidden"
              checked={newGallery.is_hidden}
              onChange={(e) => setNewGallery({ ...newGallery, is_hidden: e.target.checked })}
            />
            <label htmlFor="is_hidden">隐藏</label>
          </div>
          <button type="submit" className="submit-btn">保存</button>
        </form>
      )}

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <div className="items-list">
          {galleries.map((gallery) => (
            <div key={gallery.id} className="item">
              <div className="gallery-image">
                <img src={gallery.image_url} alt={gallery.title} />
              </div>
              <div className="gallery-info">
                <h3>{gallery.title}</h3>
                <div className="item-meta">
                  <span className={gallery.is_hidden ? 'hidden' : 'visible'}>
                    {gallery.is_hidden ? '已隐藏' : '可见'}
                  </span>
                </div>
                <div className="item-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => {
                      const updatedTitle = prompt('编辑标题:', gallery.title);
                      if (updatedTitle !== null) {
                        handleUpdateGallery(gallery.id, { ...gallery, title: updatedTitle });
                      }
                    }}
                  >
                    编辑
                  </button>
                  <button 
                    className="toggle-btn"
                    onClick={() => handleUpdateGallery(gallery.id, { ...gallery, is_hidden: !gallery.is_hidden })}
                  >
                    {gallery.is_hidden ? '显示' : '隐藏'}
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteGallery(gallery.id)}
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGalleries;