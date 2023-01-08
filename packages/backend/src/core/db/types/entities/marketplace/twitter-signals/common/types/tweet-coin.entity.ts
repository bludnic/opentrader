import {
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ITweetCoin } from './tweet-coin.interface';

export class TweetCoinEntity implements ITweetCoin {
  @IsNotEmpty()
  @IsString()
  baseCurrency: string;

  @IsNotEmpty()
  @IsString()
  quoteCurrency: string;

  constructor(coin: TweetCoinEntity) {
    Object.assign(this, coin);
  }
}
