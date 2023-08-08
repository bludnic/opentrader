import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TwitterApiClientService } from './twitter-api-client.service';

@Module({
  imports: [HttpModule],
  providers: [TwitterApiClientService],
  exports: [TwitterApiClientService],
})
export class TwitterApiModule {}
