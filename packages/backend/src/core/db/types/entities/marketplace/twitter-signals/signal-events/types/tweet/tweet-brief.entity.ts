import { IsNotEmpty, IsString } from 'class-validator';
import { ITweetBrief } from './tweet-brief.interface';

export class TweetBriefEntity implements ITweetBrief {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  author_id: string;

  @IsNotEmpty()
  @IsString()
  created_at: string;

  constructor(tweet: TweetBriefEntity) {
    Object.assign(this, tweet);
  }
}
