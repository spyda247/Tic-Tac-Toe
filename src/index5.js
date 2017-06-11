import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button 
      className="square" 
      style={props.style}
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(index, winStatus) {
    let sqrStyle = winStatus ? {color: 'red'} : {color: 'none'};
    return (
      <Square
        key={index}
        value={this.props.squares[index]} 
        onClick={() => this.props.onClick(index)}
        style={sqrStyle}
     />
    );
  }

  render() {   
    let winSqr = this.props.winSquarePositions;
    let winStatus; // Stores a boolean flag true or false to determine if the current square is a winning square
    
    let squares = [];
    let rows = [];
    let sqrId = 0; //Unique index for each square

    for(let i =  0; i < 3; i++) {
      rows = [] //resets the array for each row of squares
      for(let j = 0; j < 3; j++){
       winStatus =  (winSqr !== undefined && winSqr[j] === sqrId) ? true : false; // for each square to be rendered check its postion for match with win positions if match reture true
       rows.push(this.renderSquare(sqrId, winStatus));
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
      sortDescending: true,
    };
  }

  render() {
  const history = this.state.history;
  const current = history[this.state.stepNumber];
  const winner = calculateWinner(current.squares);
  const sortButton = 'sort-button';
  
  const moves = history.map((step, move) => {
    const desc = move ? 'Move # ' + move : 'Game start';
    const labelTag = step.labelTag;
    const moveSelected = move === this.state.stepNumber ? 'selected' : ''; 
    return (
         <li key={move}>
          <a 
            href="#move-list"
            className = {moveSelected} 
            onClick={() => this.jumpTo(move)}>
            {desc}{labelTag}
          </a>
        </li>
    );
  });
  let status;
  let winSquarePositions; // Array of wining square positions
  
  if (winner) {
    winSquarePositions = winner[1];
    status = 'Winner: ' + winner[0];
  } else {
    status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board 
          squares = {current.squares} 
          onClick = {(i) => this.handleClick(i)}
          winSquarePositions = {winSquarePositions}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol id="move-list">{moves}</ol>
        <button 
          className = {sortButton} 
          onClick={() => this.sortMove()}>
          Sort move
        </button>
      </div>
    </div> 
   );
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

  sortMove() {  
    let sortDescending = this.state.sortDescending; //Get current sort state
    let ul = document.getElementById('move-list');

    // Get the list items and setup an array for sorting
    let listItems = ul.getElementsByTagName('li');
    let list = [];

    // Populate the array
    for(let i = 0; i < listItems.length; i++){
      list.push(listItems[i].innerHTML)
    }
    
    list.sort(function(a, b){
      return b.key - a.key
    }); //sort list

    if (sortDescending) {
      list.reverse();
    }
    for(let i = 0; i < listItems.length; i++){
      listItems[i].innerHTML = list[i];
    }
    //set state
    this.setState({
     sortDescending: sortDescending,
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
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return  [squares[a], lines[i]];
    }
    
    
  }
  return null;
}