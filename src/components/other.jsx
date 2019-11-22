const App = (props) => {
  constructor(props) {
    super(props)
    this.state = {
      playing: false,
      difficulty: 0,

      game: {
        id: 1,
        board: [
          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
        ],
        state: 'new',
        mines: 10
      }
    }
  }
  newGame = event => {
    axios
      .post('https://minesweeper-api.herokuapp.com/games', {
        difficulty: this.state.difficulty
      })
      .then(response => {
        this.setState({
          playing: true,
          game: response.data
        })
      })
  }
  flagCell = (row, col) => {
    if (!this.state.playing) {
      return
    }

    axios
      .post(
        `https://minesweeper-api.herokuapp.com/games/${this.state.game.id}/flag`,
        {
          id: this.state.game.id,
          row: row,
          col: col
        }
      )
      .then(response => {
        this.setState({
          game: response.data
        })
      })
  }

  checkCell = (row, col) => {
    if (!this.state.playing) {
      return
    }
    axios
      .post(
        `https://minesweeper-api.herokuapp.com/games/${this.state.game.id}/check`,
        {
          id: this.state.game.id,
          row: row,
          col: col
        }
      )
      .then(response => {
        this.setState({
          game: response.data
        })
      })
  }
  pMessage = () => {
    if (this.state.playing) {
      if (this.state.game.state === 'won') {
        return 'You Saved Everyone 😅! 👏🤝🎖️'
      }
      if (this.state.game.state === 'lost') {
        return 'You lost everyone... 😵🤕⚰️!'
      }
      return `Please Save Us 🤪`
    } else {
      return '...'
    }
  }
  minesText = () => {
    if (this.state.playing) {
      return `Mines Left: ${this.state.game.mines}`
    } else {
      return ''
    }
  }
  buttonText = () => {
    if (this.state.game.state === 'lost') {
      return 'Try Again'
    } else {
      return 'Start Sweeping'
    }
  }
  chooseYourFate = event => {
    this.setState({
      difficulty: parseInt(event.target.value)
    })
  }
  boardRows = () => {
    return this.state.game.board.map((row, rowIndex) => {
      return (
        <tr key={rowIndex}>
          {row.map((spaceValue, index) => {
            return (
              <Cell
                key={index}
                checkCell={this.checkCell}
                flagCell={this.flagCell}
                row={rowIndex}
                col={index}
                value={spaceValue}
              />
            )
          })}
        </tr>
      )
    })
  }
  boardSize = () => {
    return this.state.game.board[0].length
  }
  render() {
    return (
      <div>
        <h1>MineSweeper</h1>
        <table>
          <tbody>
            <tr>
              <td className="header" colSpan={this.boardSize()}>
                <select
                  value={this.state.difficulty}
                  onChange={this.chooseYourFate}
                >
                  <option value="0">Easy</option>
                  <option value="1">Medium</option>
                  <option value="2">Hard</option>
                </select>
                <button onClick={this.newGame}>{this.buttonText()}</button>
              </td>
            </tr>
            <tr>
              <td colSpan={this.boardSize()}>{this.pMessage()}</td>
            </tr>
            {this.boardRows()}
            <tr>
              <td className="header" colSpan={this.boardSize()}>
                {this.minesText()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
export default App

checkCell = event => {
  props.checkCell(props.row, props.col)
}

flagCell = event => {
  event.preventDefault()

  props.flagCell(props.row,props.col)
}

cellClassName = () => {
  const Lookup = {
    '*': 'cell-bomb',
    F: 'cell-flag',
    '@': 'cell-flag',
    _: 'cell-covered',
    '1': 'cell-1',
    '2': 'cell-2',
    '3': 'cell-3',
    '4': 'cell-4',
    '5': 'cell-5',
    '6': 'cell-6',
    '7': 'cell-7',
    '8': 'cell-8'
  }
  return Lookup[props.value] || 'cell-exposed'
}

lookupValue = () => {
  const Lookup = { '*': '💥', F: '💣', '@': '🌊', _: '-' }

  let foundValue = Lookup[props.value] || props.value
  return foundValue
}

render() {
  return (
    <td
      className={cellClassName()}
      onClick={checkCell}
      onContextMenu={flagCell}
    >
      {lookupValue()}
    </td>
  )
}
}