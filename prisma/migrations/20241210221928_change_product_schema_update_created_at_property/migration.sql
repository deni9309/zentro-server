-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "createdAt" SET DEFAULT NOW(),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3);
