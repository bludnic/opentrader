/*
  Warnings:

  - You are about to drop the column `baseCurrency` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `exchangeSymbolId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `quoteCurrency` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `symbolId` on the `SmartTrade` table. All the data in the column will be lost.
  - Added the required column `exchangeSymbolId` to the `SmartTrade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "baseCurrency",
DROP COLUMN "exchangeSymbolId",
DROP COLUMN "quoteCurrency";

-- AlterTable
ALTER TABLE "SmartTrade" DROP COLUMN "symbolId",
ADD COLUMN     "exchangeSymbolId" TEXT NOT NULL;
