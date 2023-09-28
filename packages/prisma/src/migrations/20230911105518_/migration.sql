-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrderStatus" ADD VALUE 'Canceled';
ALTER TYPE "OrderStatus" ADD VALUE 'Revoked';
ALTER TYPE "OrderStatus" ADD VALUE 'Deleted';
