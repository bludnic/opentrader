export interface IGridBotSettings {
  id: string;
  name: string;
  account: string; // reference
  baseCurrency: string;
  quoteCurrency: string;
  gridLevels: number;
  lowPrice: number;
  highPrice: number;
  quantityPerGrid: number;
}
