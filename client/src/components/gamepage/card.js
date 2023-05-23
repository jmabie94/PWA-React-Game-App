import React from 'react';
import { Link } from 'react-router-dom';
import './card.css';

const Card = ({ image, title, online, single }) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <img src={image} alt={title} />
      <div className="button-container">
        <Link to={single} className="game-button">Single</Link>
        <Link to={online} className="game-button">Online</Link>
      </div>
    </div>
  );
};


export default Card;
