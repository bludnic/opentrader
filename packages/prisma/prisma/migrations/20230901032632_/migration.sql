/*
  Warnings:

  - Changed the type of `type` on the `Bot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BotType" AS ENUM ('GridBot');

-- AlterTable
ALTER TABLE "Bot" DROP COLUMN "type",
ADD COLUMN     "type" "BotType" NOT NULL;
