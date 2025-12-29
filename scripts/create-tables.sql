-- Drop existing tables to recreate with correct schema
DROP TABLE IF EXISTS "FeedStock";
DROP TABLE IF EXISTS "Transaction";

-- Create FeedStock Table (matches Prisma schema exactly)
CREATE TABLE "FeedStock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'kg',
    "pricePerUnit" REAL,
    "supplier" TEXT,
    "expiryDate" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on type for FeedStock
CREATE INDEX IF NOT EXISTS "FeedStock_type_idx" ON "FeedStock"("type");

-- Create Transaction Table (matches Prisma schema exactly)
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reference" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on type and date for Transaction
CREATE INDEX IF NOT EXISTS "Transaction_type_date_idx" ON "Transaction"("type", "date");
