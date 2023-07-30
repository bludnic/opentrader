import { countDecimalPlaces } from './countDecimalPlaces';

describe(countDecimalPlaces.name, () => {
  it('with trailing zeros', () => {
    expect(countDecimalPlaces("0.06900")).toBe(5)
  })

  it('ignore trailing zeros', () => {
    expect(countDecimalPlaces("0.06900", {
      ignoreTrailingZeros: true
    })).toBe(3)
  })
})
