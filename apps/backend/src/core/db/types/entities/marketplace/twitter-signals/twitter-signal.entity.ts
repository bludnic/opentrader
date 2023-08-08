import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { TweetCoinEntity } from './common/types/tweet-coin.entity';
import { ITweetCoin } from './common/types/tweet-coin.interface';
import { ITwitterSignal } from './twitter-signal.interface';

export class TwitterSignalEntity implements ITwitterSignal {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The `query` parameter that is passed to the Twitter API',
  })
  @IsNotEmpty()
  @IsString()
  twitterQuery: string;

  @ApiProperty({
    description: 'Should cron watch for this signal?',
  })
  @IsDefined()
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({
    type: () => TweetCoinEntity,
  })
  @ValidateNested()
  @Type(() => TweetCoinEntity)
  @IsDefined()
  coin: ITweetCoin;

  createdAt: number;

  constructor(signal: TwitterSignalEntity) {
    Object.assign(this, signal);
  }
}
