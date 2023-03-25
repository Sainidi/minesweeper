import React, { ChangeEvent, useState } from 'react';
import './App.css';
import { TextField } from "@mui/material";
import { Game } from "./types/common";
import Board from "./components/Board";
import { checkInputValue } from "./utils/common";

function App() {
  const [game, setGame] = useState<Game>({
    width: 5,
    height: 5,
  });

  const changeBoardWidth = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const width = checkInputValue(event.target.value)
    setGame(prevState => ({...prevState, width}))
  }

  const changeBoardHeight = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const height = checkInputValue(event.target.value)
    setGame(prevState => ({...prevState, height}))
  }

  return (
    <div className="App">
      <div className='header'>
        <h1>Minesweeper</h1>
        <div className='board-sizes'>
          <TextField label='Width' variant="standard" type='number' value={game.width} onChange={changeBoardWidth} />
          <TextField label='Height' variant="standard" type='number' value={game.height} onChange={changeBoardHeight} />
        </div>
      </div>

      <Board game={game} />
    </div>
  );
}

export default App;
