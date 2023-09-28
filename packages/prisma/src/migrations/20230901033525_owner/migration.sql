-- AlterTable
ALTER TABLE "Bot" ADD COLUMN     "exchangeAccountId" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "ownerId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_exchangeAccountId_fkey" FOREIGN KEY ("exchangeAccountId") REFERENCES "ExchangeAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
