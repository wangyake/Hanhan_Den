import React, { useState, useEffect } from 'react';

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/admin/games/public');
        
        if (!response.ok) {
          throw new Error('获取游戏列表失败');
        }
        
        const data = await response.json();
        setGames(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // 游戏图标映射
  const gameIcons = {
    '扫雷游戏': '/games/minesweeper-icon.svg'
  };

  // 获取游戏图标
  const getGameIcon = (gameTitle) => {
    return gameIcons[gameTitle] || '/games/minesweeper-icon.svg';
  };

  // 获取游戏链接
  const getGameLink = (gameTitle) => {
    if (gameTitle === '扫雷游戏') {
      return '/games/minesweeper.html';
    }
    return '#';
  };

  return (
    <section className="list">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        games.map((game) => (
          <div 
            key={game.id} 
            className="game-card"
            style={{
              backgroundImage: 'url(https://picsum.photos/id/119/800/300)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="game-card-overlay">
              <a href={getGameLink(game.title)} target="_blank" rel="noopener noreferrer" className="game-card-title">
                {game.title}
              </a>
            </div>
          </div>
        ))
      )}
    </section>
  );
};

export default Games;