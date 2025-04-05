import React from 'react';

interface MainMenuProps {
  onStartGame: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  return (
    <div className="main-menu">
      <h1>Cow Launch Game</h1>
      <div className="menu-buttons">
        <button onClick={onStartGame}>Start Game</button>
        <button>Options</button>
        <button>Credits</button>
      </div>
    </div>
  );
};

export default MainMenu; 