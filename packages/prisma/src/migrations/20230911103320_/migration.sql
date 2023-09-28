/*
  Warnings:

  - You are about to drop the column `passphrase` on the `ExchangeAccount` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExchangeAccount" DROP COLUMN "passphrase",
ADD COLUMN     "password" TEXT;
