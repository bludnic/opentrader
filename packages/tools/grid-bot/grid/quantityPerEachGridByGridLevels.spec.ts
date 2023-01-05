import { quantityPerEachGridByGridLevels } from './quantityPerEachGridByGridLevels';

describe('quantityPerEachGridByGridLevels', () => {
  it('base', () => {
    expect(quantityPerEachGridByGridLevels(10, 5)).toStrictEqual([
      10, 10, 10, 10, 10,
    ]);
  });
});
