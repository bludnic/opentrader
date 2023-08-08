import { ISymbolLotFilter } from '@bifrost/types';

export class SymbolLotFilterDto implements ISymbolLotFilter {
  maxQuantity: string;
  minQuantity: string;
  stepSize: string;
}
