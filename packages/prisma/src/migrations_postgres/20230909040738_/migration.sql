-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_smartTradeId_fkey";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_smartTradeId_fkey" FOREIGN KEY ("smartTradeId") REFERENCES "SmartTrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
