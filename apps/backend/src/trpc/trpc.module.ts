import { Module } from '@nestjs/common';
import { TrpcMiddleware } from './trpc.middleware';

@Module({
  imports: [],
  controllers: [],
  providers: [TrpcMiddleware],
  exports: [],
})
export class TrpcModule {}
