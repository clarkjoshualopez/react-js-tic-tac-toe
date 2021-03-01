import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


  function Square(props) {
      return (
        <button
            className={`square ${props.winner ? 'winner-square' : 'default-square'}`}
            onClick={props.squareClick}
        >
          {props.value}
        </button>
      );
  }
  
  class Board extends React.Component {
    renderSquare(i, winner) {
      return (
            <Square
                key={i}
                index={i}
                winner={winner}
                value={this.props.squares[i]} 
                squareClick={() => this.props.squareClick(i)}    
            />
        );
    }

    render() {
      let content = [];
      let squares = [];
      let a = 0;
      let winner = false;

      for (let i = 0; i <= 2; i++) {
        for (let b = 0; b <= 2; b++) {
          if (this.props.winner) {
              if (this.props.winner.indexOf(a) > -1) {
                winner = true;
              }
          }

          content.push(this.renderSquare(a, winner))
          a++;
          winner = false;
        }
        content.push(<div key={0+''+i} className="board-row">{squares}</div>)
        squares = [];
      }
      return (
        <div>
          {content}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            clickIndexes: [],
            movesOrderAsc: true,
        }    

        this.handleOrder = this.handleOrder.bind(this)
    }
    
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        squares.indexes ? squares.push({'indexes': getColandRowIndex(i)}) : squares.indexes = getColandRowIndex(i);

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        })

        if (calculateWinner(squares) !== null) {
          alert('Player (' + squares[i] + ') win the game')
        }
    }
    
    handleOrder() {
      this.setState({
          movesOrderAsc: !this.state.movesOrderAsc
      })
    }

    jumpTo(step) {
        this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
        })
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      let status;
      
      const moves = history
      .map((step, move) => {
          const desc = move ?
            'Go to move #' + move:
            'Go to game start';
          const indexes = step.squares.indexes ?
            ' - (row: ' + step.squares.indexes[0] + ' col: ' + step.squares.indexes[1] + ')':
            '';
            
            return (
                <li 
                  className="no-style" 
                  key={move}
                >
                    <button 
                      className={`history-btn ${this.state.stepNumber === move ? 'active-history' : ''}`}
                      onClick={() => this.jumpTo(move)}
                    >
                      {desc}
                    </button>
                    <span>{indexes}</span>
                </li>
            );
      })
      const movesSorted = this.state.movesOrderAsc ? moves.sort() : moves.reverse()

      if (winner !== null) {
          status = 'Winner: ' + current.squares[winner[0]];

      } else {
          status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board
                winner={winner}
                squares={current.squares}
                squareClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div style={{fontWeight: 'bold', fontSize: '1rem'}}>{status}</div>
            <ol>{movesSorted}</ol>
            <div>
              {<button onClick={this.handleOrder}>Order to {this.state.movesOrderAsc ? 'desc' : 'asc'}</button>}
            </div>
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

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [a, b, c];
      }
    }
    return null;
  }

  function getColandRowIndex(i) {
    const row = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
    ];
    let column;
    let tableIndexes = [];

    row.map((currentElem, index) => {
      column = currentElem.indexOf(i);

      if (column > -1) {
        tableIndexes.push(index+1)
        tableIndexes.push(column+1)
      }
      
      return column;
    });

    return tableIndexes
  }

  