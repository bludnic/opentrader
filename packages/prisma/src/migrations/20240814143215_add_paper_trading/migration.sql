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

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExchangeAccount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "label" TEXT,
    "exchangeCode" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,
    "password" TEXT,
    "isDemoAccount" BOOLEAN NOT NULL DEFAULT false,
    "isPaperAccount" BOOLEAN NOT NULL DEFAULT false,
    "ownerId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "expired" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ExchangeAccount_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ExchangeAccount" ("apiKey", "createdAt", "exchangeCode", "expired", "id", "isDemoAccount", "label", "name", "ownerId", "password", "secretKey", "updatedAt") SELECT "apiKey", "createdAt", "exchangeCode", "expired", "id", "isDemoAccount", "label", "name", "ownerId", "password", "secretKey", "updatedAt" FROM "ExchangeAccount";
DROP TABLE "ExchangeAccount";
ALTER TABLE "new_ExchangeAccount" RENAME TO "ExchangeAccount";
CREATE UNIQUE INDEX "ExchangeAccount_label_key" ON "ExchangeAccount"("label");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
