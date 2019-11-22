import React, { useState, useEffect } from 'react'
import Cells from './Cells'
import axios from 'axios'
import Message from './Message'

const Mines = () => {
  const apiUrl = 'https://minesweeper-api.herokuapp.com/games'
  const [gameID, setGameID] = useState([])
  const [board, setBoard] = useState([])
  const [mines, setMines] = useState([])
  const [state, setState] = useState([])

  const startGame = async () => {
    const response = await axios.post(apiUrl)
    setGameID(response.data.id)
    setBoard(response.data.board)
    setMines(response.data.mines)
    setState(response.data.state)
  }

  useEffect(() => {
    startGame()
  }, [])

  const leftClick = async (x, y) => {
    const response = await axios.post(`${apiUrl}/${gameID}/check`, {
      row: x,
      col: y
    })
    setBoard(response.data.board)
    setMines(response.data.mines)
    setState(response.data.state)
  }

  const rightClick = async (x, y) => {
    const response = await axios.post(`${apiUrl}/${gameID}/flag`, {
      row: x,
      col: y
    })
    setBoard(response.data.board)
    setMines(response.data.mines)
    setState(response.data.state)
  }

  const easyDiff = async () => {
    const response = await axios.post(apiUrl, { difficulty: 0 })
    setGameID(response.data.id)
    setBoard(response.data.board)
    setMines(response.data.mines)
    setState(response.data.state)
  }

  const medDiff = async () => {
    const response = await axios.post(apiUrl, { difficulty: 1 })
    setGameID(response.data.id)
    setBoard(response.data.board)
    setMines(response.data.mines)
    setState(response.data.state)
  }

  const hardDiff = async () => {
    const response = await axios.post(apiUrl, { difficulty: 2 })
    setGameID(response.data.id)
    setBoard(response.data.board)
    setMines(response.data.mines)
    setState(response.data.state)
  }

  const message = () => {
    if (state === 'lost') {
      setState({
        status: 'You lose!! Try again!'
      })
    } else if (state === 'won') {
      setState({
        status: 'You won! Play Again?'
      })
    }
  }

  console.log('this is the ' + message())

  return (
    <>
      <h1>Minesweeper</h1>
      <Message displayResult={state.status} />
      <section>
        <table>
          <tbody>
            {board.map((col, i) => {
              return (
                <tr key={i}>
                  {col.map((row, j) => {
                    return (
                      <Cells
                        key={j}
                        display={board[i][j]}
                        leftClick={() => leftClick(i, j)}
                        rightClick={() => rightClick(i, j)}
                      />
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        <p>To start a new game, choose a difficulty below:</p>
        <section className="gameButtons">
          <button onClick={startGame}>RESET</button>
          <button onClick={easyDiff}>EASY</button>
          <button onClick={medDiff}>MEDIUM</button>
          <button onClick={hardDiff}>HARD</button>
        </section>
      </section>
    </>
  )
}
export default Mines
