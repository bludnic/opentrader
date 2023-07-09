export function generateDealId(
    baseCurrency: string,
    quoteCurrency: string,
    gridNumber: number,
  ) {
    return `${baseCurrency}${quoteCurrency}${gridNumber}`;
  }
  