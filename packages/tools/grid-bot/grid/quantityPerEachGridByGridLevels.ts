/**
 * Returns price per each Grid.
 *
 * @param quantityPerGrid
 * @param gridLevels
 */
export function quantityPerEachGridByGridLevels(
  quantityPerGrid: number,
  gridLevels: number,
): number[] {
  return Array.from({ length: gridLevels }).map(() => quantityPerGrid);
}
