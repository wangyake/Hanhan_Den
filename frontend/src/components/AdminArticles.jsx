import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminCommon.css';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    is_hidden: false,
  });
  const navigate = useNavigate();

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const response = await fetch('http://localhost:8000/api/admin/articles', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('获取文章失败');
      }

      const data = await response.json();
      setArticles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleAddArticle = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/admin/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newArticle),
      });

      if (!response.ok) {
        throw new Error('创建文章失败');
      }

      setShowAddForm(false);
      setNewArticle({ title: '', content: '', is_hidden: false });
      fetchArticles();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateArticle = async (id, updatedArticle) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/admin/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedArticle),
      });

      if (!response.ok) {
        throw new Error('更新文章失败');
      }

      fetchArticles();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!confirm('确定要删除这篇文章吗？')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/admin/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('删除文章失败');
      }

      fetchArticles();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="list-container">
      <h1>文章管理</h1>
      {error && <div className="error-message">{error}</div>}
      
      <button 
        className="add-btn"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? '取消' : '添加文章'}
      </button>

      {showAddForm && (
        <form onSubmit={handleAddArticle} className="card">
          <h2>添加文章</h2>
          <div className="form-group">
            <label>标题</label>
            <input
              type="text"
              value={newArticle.title}
              onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>内容</label>
            <textarea
              value={newArticle.content}
              onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
              rows={5}
              required
            ></textarea>
          </div>
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="is_hidden"
              checked={newArticle.is_hidden}
              onChange={(e) => setNewArticle({ ...newArticle, is_hidden: e.target.checked })}
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
          {articles.map((article) => (
            <div key={article.id} className="item">
              <h3>{article.title}</h3>
              <div className="item-meta">
                <span>创建时间: {new Date(article.created_at).toLocaleString()}</span>
                <span className={article.is_hidden ? 'hidden' : 'visible'}>
                  {article.is_hidden ? '已隐藏' : '可见'}
                </span>
              </div>
              <div className="item-actions">
                <button 
                  className="edit-btn"
                  onClick={() => {
                    const updatedContent = prompt('编辑内容:', article.content);
                    if (updatedContent !== null) {
                      handleUpdateArticle(article.id, { ...article, content: updatedContent });
                    }
                  }}
                >
                  编辑
                </button>
                <button 
                  className="toggle-btn"
                  onClick={() => handleUpdateArticle(article.id, { ...article, is_hidden: !article.is_hidden })}
                >
                  {article.is_hidden ? '显示' : '隐藏'}
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteArticle(article.id)}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminArticles;