import { IGridBotLevel } from 'src/grid-bot/types/grid-bot-level.interface';
import { isWaitingGridLevel } from 'src/grid-bot/utils/grid/isWaitingGridLevel';

describe('isWaitingGridLevel', () => {
  it('should return `true` when `currentAssetPrice == gridLevel.price`', () => {
    const gridLevel: IGridBotLevel = {
      price: 10,
    };
    const gridStepSize = 2;
    const currentAssetPrice = 10;

    expect(isWaitingGridLevel(gridLevel, gridStepSize, currentAssetPrice)).toBe(
      true,
    );
  });

  it('should return `true` when `currentAssetPrice` is near the bottom or top of grid level', () => {
    const gridLevel: IGridBotLevel = {
      price: 10,
    };
    const gridStepSize = 2;

    expect(isWaitingGridLevel(gridLevel, gridStepSize, 8.9)).toBe(false);
    expect(isWaitingGridLevel(gridLevel, gridStepSize, 8.99)).toBe(false);
    expect(isWaitingGridLevel(gridLevel, gridStepSize, 8.999)).toBe(false);
    expect(isWaitingGridLevel(gridLevel, gridStepSize, 8.9999)).toBe(false);
    expect(
      isWaitingGridLevel(gridLevel, gridStepSize, 8.9999999999999999),
    ).toBe(false);
    expect(isWaitingGridLevel(gridLevel, gridStepSize, 9)).toBe(false);

    expect(isWaitingGridLevel(gridLevel, gridStepSize, 9.1)).toBe(true);
    expect(isWaitingGridLevel(gridLevel, gridStepSize, 9.2)).toBe(true);
    expect(isWaitingGridLevel(gridLevel, gridStepSize, 9.9)).toBe(true);
    expect(isWaitingGridLevel(gridLevel, gridStepSize, 10)).toBe(true);
    expect(isWaitingGridLevel(gridLevel, gridStepSize, 10.5)).toBe(true);
    expect(isWaitingGridLevel(gridLevel, gridStepSize, 10.9)).toBe(true);
    expect(isWaitingGridLevel(gridLevel, gridStepSize, 10.99)).toBe(true);
    expect(isWaitingGridLevel(gridLevel, gridStepSize, 10.999)).toBe(true);
    expect(
      isWaitingGridLevel(gridLevel, gridStepSize, 10.9999999999999999),
    ).toBe(true);
    expect(isWaitingGridLevel(gridLevel, gridStepSize, 11)).toBe(true);

    expect(isWaitingGridLevel(gridLevel, gridStepSize, 11.1)).toBe(false);
  });
});
