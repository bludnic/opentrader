/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "updatedAt",
ADD COLUMN     "filledAt" TIMESTAMP(3),
ADD COLUMN     "placedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SmartTrade" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
