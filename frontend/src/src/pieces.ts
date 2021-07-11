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

  constructor(type: PieceType, isFirst: boolean, column: number|null = null, row: number|null = null) {
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
    if (this.isPromoted) {
      if ('gold' === this.type) {
        throw new Error();
      }
      return {
        'rook': '龍',
        'bishop': '馬',
        'silver': '全',
        'knight': '圭',
        'lance': '杏',
        'pawn': 'と',
      }[this.type]
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
        [+Infinity, 0],
        [-Infinity, 0],
        [0, +Infinity],
        [0, -Infinity],
        ...(this.isPromoted ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : []),
      ],
      'bishop': [
        [+Infinity, +Infinity],
        [+Infinity, -Infinity],
        [-Infinity, +Infinity],
        [-Infinity, -Infinity],
        ...(this.isPromoted ? [[1, 0], [-1, 0], [0, 1], [0, -1]] : []),
      ],
      'gold': [
        [-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [0, 1],
      ],
      'silver': this.isPromoted
        ? [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [0, 1]]
        : [[-1, -1], [0, -1], [1, -1], [-1, 1], [1, 1]],
      'knight': this.isPromoted
        ? [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [0, 1]]
        : [[-1, -2], [1, -2]],
      'lance': this.isPromoted
        ? [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [0, 1]]
        : [[0, -Infinity],],
      'pawn': this.isPromoted
        ? [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [0, 1]]
        : [[0, -1],],
    }[this.type];
  }

  get canPromote(): boolean {
    return [
      'rook',
      'bishop',
      'silver',
      'knight',
      'lance',
      'pawn',
    ].includes(this.type);
  }

  get canPromoteCurrent(): boolean {
    return this.canPromote && !this.isPromoted;
  }
}
