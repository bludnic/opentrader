import { Module } from '@nestjs/common';
import { FirestoreModule } from 'src/core/db/firestore/firestore.module';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { PostgresModule } from 'src/core/db/postgres/postgres.module';

@Module({
  imports: [FirestoreModule, PostgresModule],
  exports: [FirestoreModule, PostgresModule],
  providers: [FirestoreService],
})
export class DatabaseModule {}
