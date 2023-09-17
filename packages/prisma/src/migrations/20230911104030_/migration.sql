/*
  Warnings:

  - Added the required column `baseCurrency` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quoteCurrency` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbolId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "baseCurrency" TEXT NOT NULL,
ADD COLUMN     "quoteCurrency" TEXT NOT NULL,
ADD COLUMN     "symbolId" TEXT NOT NULL;
