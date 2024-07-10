/*
  Warnings:

  - The values [COIN] on the enum `ExchangeCode` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExchangeCode_new" AS ENUM ('OKX', 'BINA');
ALTER TABLE "ExchangeAccount" ALTER COLUMN "exchangeCode" TYPE "ExchangeCode_new" USING ("exchangeCode"::text::"ExchangeCode_new");
ALTER TYPE "ExchangeCode" RENAME TO "ExchangeCode_old";
ALTER TYPE "ExchangeCode_new" RENAME TO "ExchangeCode";
DROP TYPE "ExchangeCode_old";
COMMIT;
