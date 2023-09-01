/*
  Warnings:

  - Changed the type of `exchangeCode` on the `ExchangeAccount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ExchangeCode" AS ENUM ('OKX');

-- AlterTable
ALTER TABLE "ExchangeAccount" DROP COLUMN "exchangeCode",
ADD COLUMN     "exchangeCode" "ExchangeCode" NOT NULL;
