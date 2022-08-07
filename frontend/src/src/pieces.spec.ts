import { Piece } from '../src/pieces'

describe('pieces.ts', () => {
  it('駒の生成1', () => {
    const piece = new Piece('king', true, 5, 1)
    expect(piece.id).toBe(1)
    expect(piece.type).toBe('king')
    expect(piece.isFirst).toBe(true)
    expect(piece.column).toBe(5)
    expect(piece.row).toBe(1)
    expect(piece.name).toBe('玉')
    expect(piece.movableList).toEqual([
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ])
    expect(piece.canPromote).toBe(false)
  })

  it('駒の生成2', () => {
    const piece = new Piece('king', false, 4, 4)
    expect(piece.id).toBe(2)
    expect(piece.type).toBe('king')
    expect(piece.isFirst).toBe(false)
    expect(piece.column).toBe(4)
    expect(piece.row).toBe(4)
    expect(piece.name).toBe('王')
    expect(piece.movableList).toEqual([
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ])
    expect(piece.canPromote).toBe(false)
  })
})
