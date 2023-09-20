-- CreateTable
CREATE TABLE "Exchange" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Exchange_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Market" (
    "symbol" TEXT NOT NULL,
    "exchangeCode" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Market_pkey" PRIMARY KEY ("symbol","exchangeCode")
);

-- CreateTable
CREATE TABLE "MarketTimeframe" (
    "timeframe" TEXT NOT NULL,
    "marketSymbol" TEXT NOT NULL,
    "marketExchangeCode" TEXT NOT NULL,

    CONSTRAINT "MarketTimeframe_pkey" PRIMARY KEY ("timeframe","marketSymbol","marketExchangeCode")
);

-- CreateTable
CREATE TABLE "Candlestick" (
    "timeframe" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "marketSymbol" TEXT NOT NULL,
    "marketExchangeCode" TEXT NOT NULL,
    "open" DOUBLE PRECISION NOT NULL,
    "high" DOUBLE PRECISION NOT NULL,
    "low" DOUBLE PRECISION NOT NULL,
    "close" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Candlestick_pkey" PRIMARY KEY ("timeframe","timestamp","marketSymbol","marketExchangeCode")
);

-- AddForeignKey
ALTER TABLE "Market" ADD CONSTRAINT "Market_exchangeCode_fkey" FOREIGN KEY ("exchangeCode") REFERENCES "Exchange"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketTimeframe" ADD CONSTRAINT "MarketTimeframe_marketSymbol_marketExchangeCode_fkey" FOREIGN KEY ("marketSymbol", "marketExchangeCode") REFERENCES "Market"("symbol", "exchangeCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candlestick" ADD CONSTRAINT "Candlestick_marketSymbol_marketExchangeCode_timeframe_fkey" FOREIGN KEY ("marketSymbol", "marketExchangeCode", "timeframe") REFERENCES "MarketTimeframe"("marketSymbol", "marketExchangeCode", "timeframe") ON DELETE CASCADE ON UPDATE CASCADE;
