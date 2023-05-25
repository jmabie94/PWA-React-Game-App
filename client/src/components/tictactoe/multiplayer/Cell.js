import './pvp.css';

const Cell = ({ handleCellClick, id, text }) => {
  return (
    <div id={id} className="cell" onClick={handleCellClick}>
      {text}
    </div>
  );
};

export default Cell;