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
    "logging" BOOLEAN NOT NULL DEFAULT true,
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
INSERT INTO "new_Bot" ("createdAt", "enabled", "exchangeAccountId", "id", "label", "name", "ownerId", "processing", "settings", "state", "symbol", "template", "timeframe", "type") SELECT "createdAt", "enabled", "exchangeAccountId", "id", "label", "name", "ownerId", "processing", "settings", "state", "symbol", "template", "timeframe", "type" FROM "Bot";
DROP TABLE "Bot";
ALTER TABLE "new_Bot" RENAME TO "Bot";
CREATE UNIQUE INDEX "Bot_label_key" ON "Bot"("label");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
