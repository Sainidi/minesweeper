export class Cell {
  x: number;
  y: number;
  n: number;
  isHole: boolean;
  isFlagged: boolean;
  isOpen: boolean;

  constructor(y: number, x: number, isHole: boolean) {
    this.x = x;
    this.y = y;
    this.n = 0;
    this.isHole = isHole;
    this.isFlagged = false;
    this.isOpen = false;
  }
}
