/*
  Warnings:

  - You are about to drop the column `baseCurrency` on the `Bot` table. All the data in the column will be lost.
  - You are about to drop the column `quoteCurrency` on the `Bot` table. All the data in the column will be lost.
  - You are about to drop the column `baseCurrency` on the `SmartTrade` table. All the data in the column will be lost.
  - You are about to drop the column `exchangeSymbolId` on the `SmartTrade` table. All the data in the column will be lost.
  - You are about to drop the column `quoteCurrency` on the `SmartTrade` table. All the data in the column will be lost.
  - Added the required column `symbol` to the `Bot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `SmartTrade` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT,
    "symbol" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "template" TEXT NOT NULL,
    "timeframe" TEXT,
    "processing" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "settings" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT '{}',
    "exchangeAccountId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "Bot_exchangeAccountId_fkey" FOREIGN KEY ("exchangeAccountId") REFERENCES "ExchangeAccount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Bot_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Bot" ("createdAt", "enabled", "exchangeAccountId", "id", "label", "name", "ownerId", "processing", "settings", "state", "template", "timeframe", "type", "symbol")
SELECT
  "createdAt",
  "enabled",
  "exchangeAccountId",
  "id",
  "label",
  "name",
  "ownerId",
  "processing",
  "settings",
  "state",
  "template",
  "timeframe",
  "type",
  "baseCurrency" || '/' || "quoteCurrency" AS "symbol" -- Construct symbol from baseCurrency and quoteCurrency
FROM "Bot";
DROP TABLE "Bot";
ALTER TABLE "new_Bot" RENAME TO "Bot";
CREATE UNIQUE INDEX "Bot_label_key" ON "Bot"("label");
CREATE TABLE "new_SmartTrade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "entryType" TEXT NOT NULL,
    "takeProfitType" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "ref" TEXT,
    "exchangeAccountId" INTEGER NOT NULL,
    "botId" INTEGER,
    "ownerId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SmartTrade_exchangeAccountId_fkey" FOREIGN KEY ("exchangeAccountId") REFERENCES "ExchangeAccount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SmartTrade_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SmartTrade_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SmartTrade" ("botId", "createdAt", "entryType", "exchangeAccountId", "id", "ownerId", "ref", "takeProfitType", "type", "updatedAt", "symbol")
SELECT
  "botId",
  "createdAt",
  "entryType",
  "exchangeAccountId",
  "id",
  "ownerId",
  "ref",
  "takeProfitType",
  "type",
  "updatedAt",
  "baseCurrency" || '/' || "quoteCurrency" AS "symbol" -- Construct symbol from baseCurrency and quoteCurrency
FROM "SmartTrade";
DROP TABLE "SmartTrade";
ALTER TABLE "new_SmartTrade" RENAME TO "SmartTrade";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
