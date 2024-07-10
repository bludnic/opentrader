/*
  Warnings:

  - The primary key for the `ExchangeAccount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `id` on the `ExchangeAccount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `exchangeCode` on the `ExchangeAccount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `exchangeAccountId` to the `SmartTrade` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "ExchangeAccount" DROP CONSTRAINT "ExchangeAccount_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
DROP COLUMN "exchangeCode",
ADD COLUMN     "exchangeCode" TEXT NOT NULL,
ADD CONSTRAINT "ExchangeAccount_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SmartTrade" ADD COLUMN     "exchangeAccountId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Post";

-- DropEnum
DROP TYPE "ExchangeCode";

-- AddForeignKey
ALTER TABLE "SmartTrade" ADD CONSTRAINT "SmartTrade_exchangeAccountId_fkey" FOREIGN KEY ("exchangeAccountId") REFERENCES "ExchangeAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
