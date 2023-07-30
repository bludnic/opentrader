import { BarSize } from '@bifrost/types';
import { decomposeEntityId } from './decomposeEntityId';

describe('decomposeEntityId', () => {
  it('valid entityId', () => {
    expect(decomposeEntityId('OKX:BTC/USDT#1m')).toEqual<
      ReturnType<typeof decomposeEntityId>
    >({
      symbolId: 'OKX:BTC/USDT',
      barSize: BarSize.ONE_MINUTE,
    });
  });

  it('invalid entityId', () => {
    expect(() => decomposeEntityId('OKX:BTC/USDT#1Q')).toThrowError();
  });
});
