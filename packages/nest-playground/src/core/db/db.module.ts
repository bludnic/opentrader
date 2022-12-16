import { Module } from '@nestjs/common';
import { FirestoreModule } from 'src/core/db/firestore/firestore.module';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';

@Module({
  imports: [FirestoreModule],
  exports: [FirestoreModule],
  providers: [FirestoreService],
})
export class DatabaseModule {}
