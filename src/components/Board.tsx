import React, { useEffect, useState } from 'react';
import { BoardProps, GameStatuses } from "../types/common";
import { Cell } from "./Cell";
import { Button, Modal } from "@mui/material";
import { getClass, getHolesCount, getValue, isEmptyCell } from "../utils/common";

const Board = ({game}: BoardProps) => {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [holes, setHoles] = useState<boolean[][]>([]);
  const [holesCount, setHolesCount] = useState<number>(0);
  const [gameResult, setGameResult] = useState({message: '', isOpenModal: false});

  useEffect(() => {
    generateBoard()
  }, [])

  function generateBoard() {
    const newBoard: Cell[][] = []
    const newHoles = generateRandomHoles()

    for (let i = 0; i < game.height; ++i) {
      newBoard.push([])

      for (let j = 0; j < game.width; ++j) {
        const cell = new Cell(i, j, newHoles[i][j])
        addNewCell(cell, newBoard)
      }
    }

    setHolesCount(getHolesCount(newHoles))
    setHoles(newHoles)
    setBoard(newBoard)
  }

  function generateRandomHoles() {
    const holes = []

    for (let i = 0; i < game.height; i++) {
      const row = []

      for (let j = 0; j < game.width; j++) {
        const cell = Math.random() < 0.2
        row.push(cell)
      }

      holes.push(row)
    }

    return holes
  }

  const addNewCell = (cell: Cell, board: Cell[][]) => {
    const y = board?.length - 1
    const x = board[y].length
    const neighbours = getNeighbours(y, x, board)

    for (let neighbourCell of neighbours) {
      if (cell.isHole) {
        neighbourCell.n += 1
      } else if (neighbourCell.isHole) {
        cell.n += 1
      }
    }

    board[y].push(cell)
  }

  const getNeighbours = (y: number, x: number, board: Cell[][]) => {
    const neighbours: Cell[] = []
    const currentRow = board[y]
    const prevRow = board[y - 1]
    const newRow = board[y + 1]

    if (currentRow[x - 1]) neighbours.push(currentRow[x - 1])
    if (currentRow[x + 1]) neighbours.push(currentRow[x + 1])
    if (prevRow) {
      if (prevRow[x - 1]) neighbours.push(prevRow[x - 1])
      if (prevRow[x]) neighbours.push(prevRow[x])
      if (prevRow[x + 1]) neighbours.push(prevRow[x + 1])
    }
    if (newRow) {
      if (newRow[x - 1]) neighbours.push(newRow[x - 1])
      if (newRow[x]) neighbours.push(newRow[x])
      if (newRow[x + 1]) neighbours.push(newRow[x + 1])
    }

    return neighbours
  }

  const killGame = (type?: GameStatuses) => {
    const message = type === GameStatuses.lose ? 'You lose.' : 'You won.'
    const newBoard = [...board]

    for (let row of newBoard) {
      for (let cell of row) {
        cell.isOpen = true
      }
    }

    setGameResult({message, isOpenModal: true})
    setBoard(newBoard)
  }

  const handleClickCell = (y: number, x: number) => {
    const newBoard = [...board]
    const cell = newBoard[y][x]

    if (cell.isFlagged) {
      return false
    }

    if (cell.isHole) {
      killGame(GameStatuses.lose)
      return;
    }

    if (isEmptyCell(cell)) {
      openEmptyNeighbours(y, x)
    }

    cell.isOpen = true
    setBoard(newBoard)

    checkVictory()
  }

  const openEmptyNeighbours = (y: number, x: number) => {
    const neighbours: Cell[] = [...getNeighbours(y, x, board)]

    while (neighbours.length) {
      const neighbourCell = neighbours.shift()

      if (neighbourCell) {
        if (neighbourCell.isOpen) {
          continue;
        }
        if (isEmptyCell(neighbourCell)) {
          neighbours.push(...getNeighbours(neighbourCell.y, neighbourCell.x, board))
        }
        neighbourCell.isOpen = true
      }
    }
  }

  const restartGame = () => {
    generateBoard()
  }

  const handleFlagged = (y: number, x: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()

    const cell = board[y][x]
    let holes = holesCount

    if (cell.isFlagged) {
      cell.isFlagged = false
      holes++
    } else if (holes > 0) {
      cell.isFlagged = true
      holes--
    }

    setHolesCount(holes)
  }

  const resetHoles = () => {
    if (holesCount < getHolesCount(holes)) {
      for (let row of board) {
        for (let cell of row) {
          cell.isFlagged = false
        }
      }

      setHolesCount(getHolesCount(holes))
    }
  }

  const handleCloseModal = () => {
    restartGame()
    setGameResult({message: '', isOpenModal: false})
  }

  const checkVictory = () => {
    const holesCount = getHolesCount(holes)
    let openedCells = 0

    for (let row of board) {
      for (let cell of row) {
        if (cell.isOpen) openedCells += 1
      }
    }

    if (openedCells === game.height * game.width - holesCount) {
      killGame(GameStatuses.won)
    }
  }

  return (
    <>
      <div className='mines-count'>
        <Button onClick={resetHoles}>Reset holes</Button>
        <span>Mines: {holesCount}</span>
        <Button onClick={restartGame}>Restart game</Button>
      </div>

      <div className='board'>
        {board?.map((row, rowIndex) =>
          <div className='board-row' key={row.length + rowIndex}>
            {row.map((cell, cellIndex) => (
              <Button className={`${getClass(cell)}`} key={cell.x + cell.y + cellIndex} disabled={cell.isOpen} onClick={() => handleClickCell(cell.y, cell.x)}
                onContextMenu={(event) => handleFlagged(cell.y, cell.x, event)}>
                {getValue(cell)}
              </Button>
            ))}
          </div>
        )}
      </div>

      <Modal open={gameResult.isOpenModal}>
        <div className='modal-content-container'>
          <span>{gameResult.message}</span>
          <Button onClick={handleCloseModal}>Restart game</Button>
        </div>
      </Modal>
    </>
  );
};

export default Board;
