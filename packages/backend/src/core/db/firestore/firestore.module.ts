import { Module } from '@nestjs/common';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';

@Module({
  imports: [],
  exports: [FirestoreService],
  providers: [FirestoreService],
})
export class FirestoreModule {}
