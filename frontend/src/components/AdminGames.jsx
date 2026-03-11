import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminCommon.css';

const AdminGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchGames = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const response = await fetch('http://localhost:8000/api/admin/games', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('获取游戏失败');
      }

      const data = await response.json();
      setGames(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleUpdateGame = async (id, updatedGame) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/admin/games/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedGame),
      });

      if (!response.ok) {
        throw new Error('更新游戏失败');
      }

      fetchGames();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="list-container">
      <h1>游戏管理</h1>
      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <div className="items-list">
          {games.map((game) => (
            <div key={game.id} className="item">
              <h3>{game.title}</h3>
              <p className="game-description">{game.description}</p>
              <div className="item-meta">
                <span className={game.is_hidden ? 'hidden' : 'visible'}>
                  {game.is_hidden ? '已隐藏' : '可见'}
                </span>
              </div>
              <div className="item-actions">
                <button 
                  className="toggle-btn"
                  onClick={() => handleUpdateGame(game.id, { ...game, is_hidden: !game.is_hidden })}
                >
                  {game.is_hidden ? '显示' : '隐藏'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGames;