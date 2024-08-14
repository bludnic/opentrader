-- CreateTable
CREATE TABLE "PaperAsset" (
    "currency" TEXT NOT NULL PRIMARY KEY,
    "balance" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "PaperOrder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "price" REAL,
    "filledPrice" REAL,
    "lastTradeTimestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'open',
    "fee" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
