import React from "react";
import { Cell } from "../components/Cell";

export function checkInputValue(value: string, min = 5, max = 19) {
  return Math.max(min, Math.min(Number(value), max))
}

export function isEmptyCell(cell: Cell) {
  return !cell.isHole && cell.n === 0
}

export function getClass(cell: Cell) {
  let className = ''

  if (cell.isOpen) {
    if (cell.isHole && cell.isFlagged) {
      className = 'flagged-hole'
    } else if (cell.isHole) {
      className = 'hole'
    } else if (cell.isFlagged) {
      className = 'flagged-open'
    } else if (cell.n > 0) {
      className = 'open'
    } else {
      className = 'empty'
    }
  } else if (cell.isFlagged) {
    className = 'flagged'
  }

  return className
}

export function getHolesCount(holes: boolean[][]) {
  let count = 0

  holes.map(row => row.map(cell => cell && (count += 1)))

  return count
}

export function getValue(cell: Cell) {
  let value: any = ''

  if (cell.isOpen) {
    if (cell.isHole) {
      value = <>&#128163;</>
    } else if (cell.n > 0) {
      value = cell.n

    }
  } else if (cell.isFlagged) value = <>&#9760;</>

  return value
}
