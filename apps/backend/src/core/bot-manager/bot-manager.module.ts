import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { FirestoreModule } from "src/core/db/firestore/firestore.module";
import { BotManagerService } from "./bot-manager.service";

@Module({
    imports: [HttpModule, FirestoreModule],
    providers: [BotManagerService],
    exports: [BotManagerService],
})
export class BotManagerModule {}