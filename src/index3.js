import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button 
      className="square" 
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(index) {
    return (
      <Square
        key={index}
        value={this.props.squares[index]} 
        onClick={() => this.props.onClick(index)}
     />
    );
  }

  render() {   

    let squares = [];
    let rows = [];
    let sqrId = 0; //Unique index for each square

    for(let i =  0; i < 3; i++) {
      rows = [] //resets the array for each row of squares
      for(let j = 0; j < 3; j++){
        rows.push(this.renderSquare(sqrId));
        sqrId++;
      }
      squares.push(<div key={sqrId} className="board-row">{rows}</div>)
    }

    return (
      <div>
        {squares}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
      this.state = {
      history: [{
      squares: Array(9).fill(null),
    }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const labelTag = '(' + this.squarePosition(i) + ')';
    
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    
    this.setState({
      history: history.concat([{
        squares: squares,
        labelTag: labelTag,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    })
  }

  squarePosition(i) {
    const x = Array(3);
    const y = Array(3);
    const position = [];

    for(let i = 0; i < x.length; i++) {
      for(let j = 0; j < y.length; j++) {
        position.push((i+1) + ',' + (j+1));
      }
    }
    return position[i];
}

render() {
  const history = this.state.history;
  const current = history[this.state.stepNumber];
  const winner = calculateWinner(current.squares);
  
  const moves = history.map((step, move) => {
    const desc = move ? 'Move # ' + move : 'Game start';
    const labelTag = step.labelTag;
    const moveSelected = move === this.state.stepNumber ? 'selected' : ''; 
    return (
      <li key={move}>
        <a 
          href="#"
          className = {moveSelected} 
          onClick={() => this.jumpTo(move)}>
          {desc}{labelTag}
        </a>
      </li>
    );
  });
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board 
          squares = {current.squares} 
          onClick = {(i) => this.handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div> 
   );
 }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a];
    }
  }
  return null;
}