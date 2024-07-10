-- CreateTable
CREATE TABLE "Markets" (
    "exchangeCode" "ExchangeCode" NOT NULL,
    "markets" JSONB NOT NULL,

    CONSTRAINT "Markets_pkey" PRIMARY KEY ("exchangeCode")
);
