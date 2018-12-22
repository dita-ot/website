var version = require('../version')

describe('Version match', () => {
  describe('greater than or equal', () => {
    test('1.2.3 >= 1.2.3', () => {
      expect(version.matchVersion('1.2.3', '>=1.2.3')).toBe(true)
    })
    test('2.2.3 >= 1.2.3', () => {
      expect(version.matchVersion('2.2.3', '>=1.2.3')).toBe(true)
    })
    test('1.3.3 >= 1.2.3', () => {
      expect(version.matchVersion('1.3.3', '>=1.2.3')).toBe(true)
    })
    test('1.2.4 >= 1.2.3', () => {
      expect(version.matchVersion('1.2.4', '>=1.2.3')).toBe(true)
    })
    test('0.2.3 >= 1.2.3', () => {
      expect(version.matchVersion('0.2.3', '>=1.2.3')).toBe(false)
    })
    test('1.1.3 >= 1.2.3', () => {
      expect(version.matchVersion('1.1.3', '>=1.2.3')).toBe(false)
    })
    test('1.2.2 >= 1.2.3', () => {
      expect(version.matchVersion('1.2.2', '>=1.2.3')).toBe(false)
    })

    test('1.2 >= 1.2.3', () => {
      expect(version.matchVersion('1.2', '>=1.2.3')).toBe(false)
    })
    test('2.2 >= 1.2.3', () => {
      expect(version.matchVersion('2.2', '>=1.2.3')).toBe(true)
    })
    test('1.3 >= 1.2.3', () => {
      expect(version.matchVersion('1.3', '>=1.2.3')).toBe(true)
    })
    test('1.2 >= 1.2.3', () => {
      expect(version.matchVersion('1.2', '>=1.2.3')).toBe(false)
    })
    test('0.2 >= 1.2.3', () => {
      expect(version.matchVersion('0.2', '>=1.2.3')).toBe(false)
    })
    test('1.1 >= 1.2.3', () => {
      expect(version.matchVersion('1.1', '>=1.2.3')).toBe(false)
    })
    test('1.2 >= 1.2.3', () => {
      expect(version.matchVersion('1.2', '>=1.2.3')).toBe(false)
    })

    test('1.2.3 >= 1.2', () => {
      expect(version.matchVersion('1.2.3', '>=1.2')).toBe(true)
    })
    test('2.2.3 >= 1.2', () => {
      expect(version.matchVersion('2.2.3', '>=1.2')).toBe(true)
    })
    test('1.3.3 >= 1.2', () => {
      expect(version.matchVersion('1.3.3', '>=1.2')).toBe(true)
    })
    test('1.2.4 >= 1.2', () => {
      expect(version.matchVersion('1.2.4', '>=1.2')).toBe(true)
    })
    test('0.2.3 >= 1.2', () => {
      expect(version.matchVersion('0.2.3', '>=1.2')).toBe(false)
    })
    test('1.1.3 >= 1.2', () => {
      expect(version.matchVersion('1.1.3', '>=1.2')).toBe(false)
    })
    test('1.2.2 >= 1.2', () => {
      expect(version.matchVersion('1.2.2', '>=1.2')).toBe(true)
    })
  })

  describe('greater than', () => {
    test('1.2.3 > 1.2.3', () => {
      expect(version.matchVersion('1.2.3', '>1.2.3')).toBe(false)
    })
    test('2.2.3 > 1.2.3', () => {
      expect(version.matchVersion('2.2.3', '>1.2.3')).toBe(true)
    })
    test('1.3.3 > 1.2.3', () => {
      expect(version.matchVersion('1.3.3', '>1.2.3')).toBe(true)
    })
    test('1.2.4 > 1.2.3', () => {
      expect(version.matchVersion('1.2.4', '>1.2.3')).toBe(true)
    })
    test('0.2.3 > 1.2.3', () => {
      expect(version.matchVersion('0.2.3', '>1.2.3')).toBe(false)
    })
    test('1.1.3 > 1.2.3', () => {
      expect(version.matchVersion('1.1.3', '>1.2.3')).toBe(false)
    })
    test('1.2.2 > 1.2.3', () => {
      expect(version.matchVersion('1.2.2', '>1.2.3')).toBe(false)
    })
  })

  describe('less than or equal', () => {
    test('1.2.3 <= 1.2.3', () => {
      expect(version.matchVersion('1.2.3', '<=1.2.3')).toBe(true)
    })
    test('2.2.3 <= 1.2.3', () => {
      expect(version.matchVersion('2.2.3', '<=1.2.3')).toBe(false)
    })
    test('1.3.3 <= 1.2.3', () => {
      expect(version.matchVersion('1.3.3', '<=1.2.3')).toBe(false)
    })
    test('1.2.4 <= 1.2.3', () => {
      expect(version.matchVersion('1.2.4', '<=1.2.3')).toBe(false)
    })
    test('0.2.3 <= 1.2.3', () => {
      expect(version.matchVersion('0.2.3', '<=1.2.3')).toBe(true)
    })
    test('1.1.3 <= 1.2.3', () => {
      expect(version.matchVersion('1.1.3', '<=1.2.3')).toBe(true)
    })
    test('1.2.2 <= 1.2.3', () => {
      expect(version.matchVersion('1.2.2', '<=1.2.3')).toBe(true)
    })
  })
  describe('less than', () => {
    test('1.2.3 < 1.2.3', () => {
      expect(version.matchVersion('1.2.3', '<1.2.3')).toBe(false)
    })
    test('2.2.3 < 1.2.3', () => {
      expect(version.matchVersion('2.2.3', '<1.2.3')).toBe(false)
    })
    test('1.3.3 < 1.2.3', () => {
      expect(version.matchVersion('1.3.3', '<1.2.3')).toBe(false)
    })
    test('1.2.4 < 1.2.3', () => {
      expect(version.matchVersion('1.2.4', '<1.2.3')).toBe(false)
    })
    test('0.2.3 < 1.2.3', () => {
      expect(version.matchVersion('0.2.3', '<1.2.3')).toBe(true)
    })
    test('1.1.3 < 1.2.3', () => {
      expect(version.matchVersion('1.1.3', '<1.2.3')).toBe(true)
    })
    test('1.2.2 < 1.2.3', () => {
      expect(version.matchVersion('1.2.2', '<1.2.3')).toBe(true)
    })
  })
})
