import { ref, computed } from 'vue'
import { Piece, PieceType } from '../src/pieces'

type StandPiece = {
  type: PieceType
  name: string
  count: number
}

const COLUMNS = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const ROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

/**
 * @param name 駒の名前
 * @param positions 先手の駒配置の配列 [[column, row], [column, row], ...]
 * @return 先手後手両方分のPieceのconstructorの引数
 */
const splitFirstAndSecond = (
  name: PieceType,
  positions: [number, number][]
): [PieceType, boolean, number, number][] =>
  positions
    .flatMap((position): [boolean, number, number][] => [
      // 先手
      [true, position[0], position[1]],
      // 後手
      [false, 10 - position[0], 10 - position[1]],
    ])
    .map((position): [PieceType, boolean, number, number] => [
      name,
      ...position,
    ])

const initPieces = () => {
  return [
    ...splitFirstAndSecond('king', [[5, 9]]),
    ...splitFirstAndSecond('rook', [[2, 8]]),
    ...splitFirstAndSecond('bishop', [[8, 8]]),
    ...splitFirstAndSecond('gold', [
      [4, 9],
      [6, 9],
    ]),
    ...splitFirstAndSecond('silver', [
      [3, 9],
      [7, 9],
    ]),
    ...splitFirstAndSecond('knight', [
      [2, 9],
      [8, 9],
    ]),
    ...splitFirstAndSecond('lance', [
      [1, 9],
      [9, 9],
    ]),
    ...splitFirstAndSecond('pawn', [
      [1, 7],
      [2, 7],
      [3, 7],
      [4, 7],
      [5, 7],
      [6, 7],
      [7, 7],
      [8, 7],
      [9, 7],
    ]),
  ].map(([type, isFirst, column, row]) => new Piece(type, isFirst, column, row))
}

const reduceStandPieces = (carry: StandPiece[], piece: Piece) => {
  const c = carry.find((p) => p.type === piece.type)
  if (c) {
    c.count += 1
  } else {
    carry.push({
      type: piece.type,
      name: piece.name,
      count: 1,
    })
  }
  return carry
}

export default function useGame() {
  // data
  const pieces = ref(initPieces())
  const isFirst = ref(true)
  const lastMovedPieceId = ref<number | null>(null)
  const selectedId = ref<number | null>(null)
  const selectedTypeOnStand = ref<PieceType | null>(null)

  // computed properties
  // 盤上にある駒
  const onBoardPieces = computed(() =>
    pieces.value.filter((piece) => piece.column !== null)
  )

  // 先手番の駒台にある駒
  const firstStandPieces = computed(() =>
    pieces.value
      .filter((piece) => piece.isFirst)
      .filter((piece) => piece.column === null)
      .reduce(reduceStandPieces, [])
  )

  // 後手番の駒台にある駒
  const secondStandPieces = computed(() =>
    pieces.value
      .filter((piece) => !piece.isFirst)
      .filter((piece) => piece.column === null)
      .reduce(reduceStandPieces, [])
  )

  // 今選択されている駒
  const selected = computed(() =>
    pieces.value.find((p) => p.id === selectedId.value)
  )

  // 今動かせる駒のリスト
  const currentMovableList = computed(() => {
    if (selectedTypeOnStand.value) {
      // 駒台の駒が選択されている場合
      const boxes = []
      for (const c of COLUMNS) {
        for (const r of ROWS) {
          if (!pieces.value.find((p) => p.column === c && p.row === r)) {
            boxes.push([c, r])
          }
        }
      }

      return boxes
    }

    if (
      !selected.value ||
      selected.value.column === null ||
      selected.value.row === null
    ) {
      return []
    }

    // 先手なら+1, 後手なら-1をかける
    const sign = selected.value.isFirst ? 1 : -1

    const selectedColumn = selected.value.column
    const selectedRow = selected.value.row

    return (
      selected.value.movableList
        // 移動量に、手番を反映する.
        .map(([column, row]) => [sign * column, sign * row])
        // 現在のマスから見た移動可能マスに変換
        .flatMap(([column, row]) => {
          if (isFinite(column) && isFinite(row)) {
            return [[selectedColumn + column, selectedRow + row]]
          }
          // 無限に進める駒.
          // Infinity -> 1, -Infinity -> -1, 0 -> 0.
          const columnSign = Math.sign(column)
          const rowSign = Math.sign(row)

          const res = []
          for (const i of [...Array(8).keys()].map((i) => i + 1)) {
            // 移動先のマス.
            const nextBlock = [
              selectedColumn + i * columnSign,
              selectedRow + i * rowSign,
            ]

            // 当該マスに今いる駒.
            const existPiece = getPiece(nextBlock[0], nextBlock[1])

            if (existPiece) {
              // 当該マスにすでに駒がある場合.
              if (existPiece.isFirst !== selected.value.isFirst) {
                // 敵の駒なら取れる.
                res.push(nextBlock)
              }
              // これ以上先には移動できない.
              break
            }
            res.push(nextBlock)
          }
          return res
        })
        // 番外のマスを除く
        .filter(
          ([column, row]) => column >= 1 && column <= 9 && row >= 1 && row <= 9
        )
    )
  })

  // methods

  // 指定したマスにある駒を取得する
  const getPiece = (column: number, row: number) =>
    pieces.value.find((p) => p.column === column && p.row === row)

  // マスを選択.
  const selectBox = (column: number, row: number) => {
    if (!isMovableBox(column, row)) {
      return
    }
    if (selected.value) {
      movePiece(selected.value, column, row)
    } else {
      const piece = pieces.value
        .filter((p) => p.isFirst === isFirst.value)
        .filter((p) => !p.column)
        .find((p) => p.type === selectedTypeOnStand.value)
      movePiece(piece, column, row, null, true)
    }
  }

  // 駒を選択.
  const selectPiece = (id: number) => {
    const piece = pieces.value.find((p) => p.id === id)

    if (!isMovableBox(piece.column, piece.row)) {
      if (isFirst.value === piece.isFirst) {
        selectedId.value = id
        selectedTypeOnStand.value = null
      }
      return
    }

    movePiece(selected.value, piece.column, piece.row, piece)
  }

  // 駒台の駒を選択
  const selectPieceOnStand = (pieceIsFirst: boolean, type: PieceType) => {
    if (pieceIsFirst !== isFirst.value) {
      // 相手の駒台には触れない.
      return
    }
    selectedId.value = null
    selectedTypeOnStand.value = type
  }

  // 駒を動かす
  const movePiece = (
    piece: Piece,
    column: number,
    row: number,
    captured: Piece | null = null,
    fromStand = false
  ) => {
    if (captured) {
      captured.isFirst = isFirst.value
      captured.column = null
      captured.row = null
      captured.isPromoted = false
    }

    if (!fromStand) {
      // 駒を成る

      // 駒の移動先が敵の陣地かどうか
      const isBaseOfOpponents = (isFirst: boolean, row: number) =>
        isFirst ? [1, 2, 3].includes(row) : [7, 8, 9].includes(row)
      if (
        piece.canPromoteCurrent &&
        ((piece.row !== null && isBaseOfOpponents(piece.isFirst, piece.row)) ||
          isBaseOfOpponents(piece.isFirst, row))
      ) {
        if (confirm('成りますか？')) {
          piece.isPromoted = true
        }
      }
    }
    piece.column = column
    piece.row = row
    lastMovedPieceId.value = piece.id
    nextTurn()
  }

  // 手番を次に移動.
  const nextTurn = () => {
    isFirst.value = !isFirst.value
    selectedId.value = null
    selectedTypeOnStand.value = null
  }

  // 現在選択中の駒にとって、移動可能なマスかどうか.
  const isMovableBox = (column: number, row: number) => {
    if (!selected.value && !selectedTypeOnStand.value) {
      // 駒を未選択の場合
      return false
    }

    if (
      pieces.value.find(
        (piece) =>
          piece.isFirst === isFirst.value &&
          piece.column === column &&
          piece.row === row
      )
    ) {
      // すでに自分の駒があるマスの場合
      return false
    }

    return !!currentMovableList.value.find(
      ([c, r]) => c === column && r === row
    )
  }

  return {
    // data
    pieces,
    isFirst,
    lastMovedPieceId,
    selectedId,
    selectedTypeOnStand,

    // computed
    onBoardPieces,
    firstStandPieces,
    secondStandPieces,
    selected,
    currentMovableList,

    // methods
    selectBox,
    selectPiece,
    selectPieceOnStand,
    isMovableBox,
  }
}
