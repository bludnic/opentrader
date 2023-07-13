import { IsDefined, IsNumber } from 'class-validator';
import { IGridLine } from './grid-line.interface';

export class GridLineEntity implements IGridLine {
  @IsDefined()
  @IsNumber()
  price: number;

  @IsDefined()
  @IsNumber()
  quantity: number;
}
