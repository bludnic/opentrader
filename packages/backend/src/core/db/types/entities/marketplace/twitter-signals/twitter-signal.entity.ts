import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsNotEmpty, IsString } from 'class-validator';
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

  createdAt: number;

  constructor(signal: TwitterSignalEntity) {
    Object.assign(this, signal);
  }
}
