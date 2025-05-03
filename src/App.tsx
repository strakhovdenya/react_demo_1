import React from 'react';
import logo from './logo.svg';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="card card-horizontal">
        <img src={logo} className="card-logo-left" alt="Логотип" />
        <div className="card-content">
          <h2>React Карточка</h2>
          <p>
            Это простая карточка с логотипом React слева и описанием справа. Ты можешь изменить текст и стили по своему вкусу!
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
