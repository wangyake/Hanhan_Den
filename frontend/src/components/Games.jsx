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
    '扫雷游戏': '/games/minesweeper-icon.svg',
    '打字游戏': '/games/typing-icon.svg'
  };

  // 游戏背景图映射（使用本地图片）
  const gameBackgrounds = {
    // 经典扫雷：使用带有科技感的图片
    '扫雷游戏': '/images/minesweeper-bg.webp',
    // 打字游戏：使用与键盘相关的图片
    '打字游戏': '/images/typing-game-bg.webp'
  };

  // 硬编码游戏数据，确保背景图显示
  const hardcodedGames = [
    {
      id: 1,
      title: '扫雷游戏',
      description: '经典扫雷游戏，有三个难度级别',
      is_hidden: false
    },
    {
      id: 2,
      title: '打字游戏',
      description: '打字练习游戏，提高打字速度',
      is_hidden: false
    }
  ];

  // 获取游戏图标
  const getGameIcon = (gameTitle) => {
    return gameIcons[gameTitle] || '/games/minesweeper-icon.svg';
  };

  // 获取游戏背景图
  const getGameBackground = (gameTitle) => {
    return gameBackgrounds[gameTitle] || 'https://picsum.photos/id/119/800/300';
  };

  // 获取游戏链接
  const getGameLink = (gameTitle) => {
    if (gameTitle === '扫雷游戏') {
      return '/games/minesweeper.html';
    }
    if (gameTitle === '打字游戏') {
      return '/games/typing-game.html';
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
        hardcodedGames.map((game) => {
          const link = getGameLink(game.title);
          const icon = getGameIcon(game.title);
          const bg = getGameBackground(game.title);
          
          return (
            <div 
              key={game.id} 
              className="game-card"
            >
              <div 
                className="game-card-bg"
                style={{
                  backgroundImage: `url(${bg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div className="game-card-overlay">
                <a 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="game-card-title"
                >
                  <img 
                    src={icon} 
                    alt={`${game.title} 图标`} 
                    style={{ width: '24px', height: '24px', marginRight: '8px', verticalAlign: 'middle' }} 
                  />
                  {game.title}
                </a>
              </div>
            </div>
          );
        })
      )}
    </section>
  );
};

export default Games;