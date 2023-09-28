/*
  Warnings:

  - Added the required column `ownerId` to the `SmartTrade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SmartTrade" ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SmartTrade" ADD CONSTRAINT "SmartTrade_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
