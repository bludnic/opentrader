-- CreateTable
CREATE TABLE "_AdditionalExchangeAccounts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AdditionalExchangeAccounts_A_fkey" FOREIGN KEY ("A") REFERENCES "Bot" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AdditionalExchangeAccounts_B_fkey" FOREIGN KEY ("B") REFERENCES "ExchangeAccount" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_AdditionalExchangeAccounts_AB_unique" ON "_AdditionalExchangeAccounts"("A", "B");

-- CreateIndex
CREATE INDEX "_AdditionalExchangeAccounts_B_index" ON "_AdditionalExchangeAccounts"("B");
