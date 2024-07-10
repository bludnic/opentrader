-- DropForeignKey
ALTER TABLE "SmartTrade" DROP CONSTRAINT "SmartTrade_botId_fkey";

-- AddForeignKey
ALTER TABLE "SmartTrade" ADD CONSTRAINT "SmartTrade_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
