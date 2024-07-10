/*
  Warnings:

  - You are about to drop the `Market` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Market";

-- CreateTable
CREATE TABLE "Markets" (
    "exchangeCode" "ExchangeCode" NOT NULL,
    "markets" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Markets_pkey" PRIMARY KEY ("exchangeCode")
);
