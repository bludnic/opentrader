import { isValidEntityId } from './isValidEntityId';

describe('isValidEntityId', () => {
  it('with valid `symbolId` and `barSize`', () => {
    expect(isValidEntityId('OKX:BTC/USDT#1m')).toBe(true);
  });

  it('with valid `symbolId` but invalid `barSize`', () => {
    expect(isValidEntityId('OKX:BTC/USDT#1Q')).toBe(false);
  });
});
