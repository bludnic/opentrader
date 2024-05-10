/*
  Warnings:

  - A unique constraint covering the columns `[label]` on the table `Bot` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[label]` on the table `ExchangeAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Bot" ADD COLUMN     "label" TEXT;

-- AlterTable
ALTER TABLE "ExchangeAccount" ADD COLUMN     "label" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Bot_label_key" ON "Bot"("label");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeAccount_label_key" ON "ExchangeAccount"("label");
