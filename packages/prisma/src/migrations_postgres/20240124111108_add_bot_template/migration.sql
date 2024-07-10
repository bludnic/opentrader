-- AlterTable
ALTER TABLE "Bot" ADD COLUMN "template" TEXT;
UPDATE "Bot" SET "template" = 'gridBot' WHERE "template" IS NULL;
ALTER TABLE "Bot" ALTER COLUMN "template" SET NOT NULL;

