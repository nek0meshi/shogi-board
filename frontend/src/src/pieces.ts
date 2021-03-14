export type PieceType =
  'king' // 王将・玉将
  | 'rook' // 飛車
  | 'bishop' // 角行
  | 'gold' // 金将
  | 'silver' // 銀将
  | 'knight' // 桂馬
  | 'lance' // 香車
  | 'pawn'; // 歩兵

let autoIncrementId = 1;

export class Piece {
  id: number;
  type: PieceType; // 駒の種類
  isFirst: boolean; // true: 先手, false: 後手
  isPromoted: boolean; // true: 成り
  column: number | null; // 列, 1 ~ 9
  row: number | null; // 行, 1 ~ 9

  constructor(type: PieceType, isFirst: boolean, column?: number, row?: number) {
    this.type = type;
    this.isFirst = isFirst;
    this.isPromoted = false;
    this.column = column;
    this.row = row;
    this.id = autoIncrementId;
    autoIncrementId += 1;
  }

  get name(): string {
    if (this.type === 'king') {
      return this.isFirst ? '玉' : '王';
    }
    return {
      'rook': '飛',
      'bishop': '角',
      'gold': '金',
      'silver': '銀',
      'knight': '桂',
      'lance': '香',
      'pawn': '歩',
    }[this.type];
  }

  get movableList(): number[][] {
    return {
      'king': [
        [-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1],
      ],
      'rook': [
        ...[...Array(8).keys()].map((i) => [0, i]),
        ...[...Array(8).keys()].map((i) => [0, -i]),
        ...[...Array(8).keys()].map((i) => [i, 0]),
        ...[...Array(8).keys()].map((i) => [-i, 0]),
      ],
      'bishop': [
        ...[...Array(8).keys()].map((i) => [i, i]),
        ...[...Array(8).keys()].map((i) => [-i, -i]),
        ...[...Array(8).keys()].map((i) => [i, -i]),
        ...[...Array(8).keys()].map((i) => [-i, i]),
      ],
      'gold': [
        [-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [0, 1],
      ],
      'silver': [
        [-1, -1], [0, -1], [1, -1], [-1, 1], [1, 1],
      ],
      'knight': [
        [-1, -2], [1, -2],
      ],
      'lance': [
        ...[...Array(8).keys()].map((i) => [0, -i]),
      ],
      'pawn': [
        [0, -1],
      ],
    }[this.type];
  }

  get currentMovableList(): number[][] {
    // 先手なら+1, 後手なら-1をかける
    const sign = this.isFirst ? 1 : -1

    return this.movableList
      .map(([column, row]) => [sign * column, sign * row])
      // 現在のマスから見た移動可能マスに変換
      .map(([column, row]) => [this.column + column, this.row + row])
      // 番外のマスを除く
      .filter(([column, row]) => column >= 1 && column <= 9 && row >= 1 && row <= 9)
  }
}
