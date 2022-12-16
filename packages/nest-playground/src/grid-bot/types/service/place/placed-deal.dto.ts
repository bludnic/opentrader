import { PlacedOrderDto } from 'src/grid-bot/types/service/place/placed-order.dto';

export class PlacedDealDto {
  // dealId: string; // сложно достать, обойдусь без этого пока
  buyOrder?: PlacedOrderDto;
  sellOrder?: PlacedOrderDto;
}
