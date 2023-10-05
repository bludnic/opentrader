/*
  Warnings:

  - You are about to drop the `Markets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Markets";

-- CreateTable
CREATE TABLE "Market" (
    "exchangeCode" "ExchangeCode" NOT NULL,
    "markets" JSONB NOT NULL,

    CONSTRAINT "Market_pkey" PRIMARY KEY ("exchangeCode")
);
