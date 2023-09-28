/*
  Warnings:

  - Changed the type of `type` on the `SmartTrade` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SmartTradeType" AS ENUM ('Buy', 'Sell', 'Trade');

-- AlterTable
ALTER TABLE "SmartTrade" DROP COLUMN "type",
ADD COLUMN     "type" "SmartTradeType" NOT NULL;
