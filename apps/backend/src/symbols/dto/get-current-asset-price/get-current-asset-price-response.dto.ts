import { IGetMarketPriceResponse } from '@bifrost/types';

export class GetCurrentAssetPriceResponseDto
  implements Omit<IGetMarketPriceResponse, 'symbol'>
{
  price: number;
  timestamp: number;
}
