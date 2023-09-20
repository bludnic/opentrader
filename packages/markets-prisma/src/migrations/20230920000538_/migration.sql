/*
  Warnings:

  - The primary key for the `Candlestick` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Exchange` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Market` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MarketTimeframe` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `marketExchangeCode` on the `Candlestick` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `code` on the `Exchange` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `exchangeCode` on the `Market` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `marketExchangeCode` on the `MarketTimeframe` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ExchangeCode" AS ENUM ('OKX');

-- DropForeignKey
ALTER TABLE "Candlestick" DROP CONSTRAINT "Candlestick_marketSymbol_marketExchangeCode_timeframe_fkey";

-- DropForeignKey
ALTER TABLE "Market" DROP CONSTRAINT "Market_exchangeCode_fkey";

-- DropForeignKey
ALTER TABLE "MarketTimeframe" DROP CONSTRAINT "MarketTimeframe_marketSymbol_marketExchangeCode_fkey";

-- AlterTable
ALTER TABLE "Candlestick" DROP CONSTRAINT "Candlestick_pkey",
DROP COLUMN "marketExchangeCode",
ADD COLUMN     "marketExchangeCode" "ExchangeCode" NOT NULL,
ADD CONSTRAINT "Candlestick_pkey" PRIMARY KEY ("timeframe", "timestamp", "marketSymbol", "marketExchangeCode");

-- AlterTable
ALTER TABLE "Exchange" DROP CONSTRAINT "Exchange_pkey",
DROP COLUMN "code",
ADD COLUMN     "code" "ExchangeCode" NOT NULL,
ADD CONSTRAINT "Exchange_pkey" PRIMARY KEY ("code");

-- AlterTable
ALTER TABLE "Market" DROP CONSTRAINT "Market_pkey",
DROP COLUMN "exchangeCode",
ADD COLUMN     "exchangeCode" "ExchangeCode" NOT NULL,
ADD CONSTRAINT "Market_pkey" PRIMARY KEY ("symbol", "exchangeCode");

-- AlterTable
ALTER TABLE "MarketTimeframe" DROP CONSTRAINT "MarketTimeframe_pkey",
DROP COLUMN "marketExchangeCode",
ADD COLUMN     "marketExchangeCode" "ExchangeCode" NOT NULL,
ADD CONSTRAINT "MarketTimeframe_pkey" PRIMARY KEY ("timeframe", "marketSymbol", "marketExchangeCode");

-- AddForeignKey
ALTER TABLE "Market" ADD CONSTRAINT "Market_exchangeCode_fkey" FOREIGN KEY ("exchangeCode") REFERENCES "Exchange"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketTimeframe" ADD CONSTRAINT "MarketTimeframe_marketSymbol_marketExchangeCode_fkey" FOREIGN KEY ("marketSymbol", "marketExchangeCode") REFERENCES "Market"("symbol", "exchangeCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candlestick" ADD CONSTRAINT "Candlestick_marketSymbol_marketExchangeCode_timeframe_fkey" FOREIGN KEY ("marketSymbol", "marketExchangeCode", "timeframe") REFERENCES "MarketTimeframe"("marketSymbol", "marketExchangeCode", "timeframe") ON DELETE CASCADE ON UPDATE CASCADE;
