/*
  Warnings:

  - The primary key for the `Candlestick` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `timestamp` on the `Candlestick` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Candlestick" DROP CONSTRAINT "Candlestick_pkey",
DROP COLUMN "timestamp",
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Candlestick_pkey" PRIMARY KEY ("timeframe", "timestamp", "marketSymbol", "marketExchangeCode");
