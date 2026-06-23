-- AlterTable: add status column to recommendations
ALTER TABLE "recommendations" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'active';
