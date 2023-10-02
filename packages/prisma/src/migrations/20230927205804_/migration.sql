/*
  Warnings:

  - The values [Buy,Sell] on the enum `SmartTradeType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `entityType` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entryType` to the `SmartTrade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `takeProfitType` to the `SmartTrade` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('Limit', 'Market');

-- CreateEnum
CREATE TYPE "EntryType" AS ENUM ('Order', 'Ladder');

-- CreateEnum
CREATE TYPE "TakeProfitType" AS ENUM ('Order', 'Ladder');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('EntryOrder', 'TakeProfitOrder', 'StopLossOrder', 'SafetyOrder');

-- AlterEnum
BEGIN;
CREATE TYPE "SmartTradeType_new" AS ENUM ('Trade', 'DCA');
ALTER TABLE "SmartTrade" ALTER COLUMN "type" TYPE "SmartTradeType_new" USING ("type"::text::"SmartTradeType_new");
ALTER TYPE "SmartTradeType" RENAME TO "SmartTradeType_old";
ALTER TYPE "SmartTradeType_new" RENAME TO "SmartTradeType";
DROP TYPE "SmartTradeType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "entityType" "EntityType" NOT NULL,
ADD COLUMN     "type" "OrderType" NOT NULL;

-- AlterTable
ALTER TABLE "SmartTrade" ADD COLUMN     "entryType" "EntryType" NOT NULL,
ADD COLUMN     "takeProfitType" "TakeProfitType" NOT NULL;
