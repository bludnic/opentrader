-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- Create the new_Order table with the new columns
CREATE TABLE "new_Order" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "status" TEXT NOT NULL DEFAULT 'Idle',
  "type" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "side" TEXT NOT NULL,
  "price" REAL,
  "filledPrice" REAL,
  "fee" REAL,
  "symbol" TEXT NOT NULL,
  "exchangeAccountId" INTEGER NOT NULL,
  "exchangeOrderId" TEXT,
  "quantity" REAL NOT NULL,
  "smartTradeId" INTEGER NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "placedAt" DATETIME,
  "syncedAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
  "filledAt" DATETIME,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Order_exchangeAccountId_fkey" FOREIGN KEY ("exchangeAccountId") REFERENCES "ExchangeAccount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Order_smartTradeId_fkey" FOREIGN KEY ("smartTradeId") REFERENCES "SmartTrade" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Migrate the data and map symbol and exchangeAccountId from the SmartTrade table
INSERT INTO "new_Order" ("createdAt", "entityType", "exchangeOrderId", "fee", "filledAt", "filledPrice", "id", "placedAt", "price", "quantity", "side", "smartTradeId", "status", "syncedAt", "type", "updatedAt", "symbol", "exchangeAccountId")
SELECT
  o."createdAt",
  o."entityType",
  o."exchangeOrderId",
  o."fee",
  o."filledAt",
  o."filledPrice",
  o."id",
  o."placedAt",
  o."price",
  o."quantity",
  o."side",
  o."smartTradeId",
  o."status",
  o."syncedAt",
  o."type",
  o."updatedAt",
  s."symbol",
  s."exchangeAccountId"
FROM "Order" o JOIN "SmartTrade" s ON o."smartTradeId" = s."id";

-- Drop the old Order table
DROP TABLE "Order";

-- Rename the new table to Order
ALTER TABLE "new_Order" RENAME TO "Order";

-- Enable foreign key constraints
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
