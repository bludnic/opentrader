import { multiplyPriceByPercent } from './multiplyPriceByPercent';

describe('multiplyPriceByPercent', () => {
  it('should add 10% to the TP price', () => {
    expect(multiplyPriceByPercent(200, 10)).toBe(220);
  });

  it('should subtract 10% from the SL price', () => {
    expect(multiplyPriceByPercent(200, -10)).toBe(180);
  });
});
