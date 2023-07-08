import { isWaitingGridLine } from './isWaitingGridLine';
import { IGridLine } from './types/grid-line.interface';

const gridLines: IGridLine[] = [
  {
    price: 1,
    quantity: 10,
  },
  {
    price: 2,
    quantity: 10,
  },
  {
    price: 3,
    quantity: 10,
  },
  {
    price: 4,
    quantity: 10,
  },
  {
    price: 5,
    quantity: 10,
  },
];

describe('isWaitingGridLine', () => {
  it('should throw an error when `gridLines` does not contain provided `gridLine`', () => {
    expect(() =>
      isWaitingGridLine(
        {
          price: 3,
          quantity: 5, // this grid line is not in the gridLines list
        },
        gridLines,
        3,
      ),
    ).toThrow(Error);
  });

  it('with exact price', () => {
    expect(
      isWaitingGridLine(
        {
          price: 3,
          quantity: 10,
        },
        gridLines,
        3,
      ),
    ).toBe(true);
  });

  it('near the `currentAssetPrice`', () => {
    expect(
      isWaitingGridLine(
        {
          price: 3,
          quantity: 10,
        },
        gridLines,
        2.9,
      ),
    ).toBe(true);

    expect(
      isWaitingGridLine(
        {
          price: 3,
          quantity: 10,
        },
        gridLines,
        2.6,
      ),
    ).toBe(true);
  });

  it('should pick upper `gridLine` when `currentAssetPrice` is at the edge of two grid lines', () => {
    expect(
      isWaitingGridLine(
        {
          price: 3,
          quantity: 10,
        },
        gridLines,
        2.5,
      ),
    ).toBe(true);

    expect(
      isWaitingGridLine(
        {
          price: 2,
          quantity: 10,
        },
        gridLines,
        2.5,
      ),
    ).toBe(false);
  });
});
