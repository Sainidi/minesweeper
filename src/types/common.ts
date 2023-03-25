export type Game = {
  width: number,
  height: number,
}

export enum GameStatuses {
  lose = 'lose',
  won = 'won'
}

export type BoardProps = {
  game: Game
}
