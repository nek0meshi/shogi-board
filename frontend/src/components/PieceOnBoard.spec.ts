import { mount } from '@vue/test-utils'
import { Piece } from '../src/pieces'
import PieceOnBoard from './PieceOnBoard.vue'

describe('PieceOnBoard.vue', () => {
  it('駒の名前表示', () => {
    const component = mount(PieceOnBoard as any, {
      propsData: {
        piece: new Piece('pawn', true, 1, 1),
        isLastMoved: false,
        isSelected: false,
      }
    })

    const div = component.find('div')

    expect(div.text()).toBe('歩')
  })
})