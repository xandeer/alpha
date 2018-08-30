import utils from '../src/utils'

describe('removeOutmostQuotation', () => {
  describe('returns original string', () => {
    test('not wrap with chinese quotation', () => {
      expect(utils.removeOutmostQuotation('hello')).toEqual('hello')
    })
    test('quotations are match before end', () => {
      expect(utils.removeOutmostQuotation('“hello” “hello”')).toEqual('“hello” “hello”')
    })
  })
  describe('remove outmost quotation', () => {
    test('just a pair of quotation', () => {
      expect(utils.removeOutmostQuotation('“hello”')).toEqual('hello')
    })
    test('quotation with quotation', () => {
      expect(utils.removeOutmostQuotation('“hello “hello””')).toEqual('hello “hello”')
    })
  })
})