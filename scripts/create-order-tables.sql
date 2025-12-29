-- Create User Table (required for orders)
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'BUYER',
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Order Table
CREATE TABLE IF NOT EXISTS "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL,
    "subtotal" REAL NOT NULL,
    "discount" REAL NOT NULL DEFAULT 0,
    "tax" REAL NOT NULL DEFAULT 0,
    "shippingCost" REAL NOT NULL DEFAULT 0,
    "totalAmount" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID',
    "paymentMethod" TEXT,
    "eventType" TEXT,
    "eventDate" DATETIME,
    "eventDetails" TEXT,
    "deliveryMethod" TEXT NOT NULL DEFAULT 'PICKUP',
    "deliveryAddress" TEXT,
    "deliveryDate" DATETIME,
    "deliveryNotes" TEXT,
    "confirmedAt" DATETIME,
    "paidAt" DATETIME,
    "shippedAt" DATETIME,
    "deliveredAt" DATETIME,
    "cancelledAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id")
);

-- Create OrderItem Table
CREATE TABLE IF NOT EXISTS "OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "goatId" TEXT NOT NULL,
    "priceAtPurchase" REAL NOT NULL,
    "weightAtPurchase" REAL NOT NULL,
    FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE,
    FOREIGN KEY ("goatId") REFERENCES "Goat"("id")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
CREATE INDEX IF NOT EXISTS "Order_userId_status_idx" ON "Order"("userId", "status");
CREATE INDEX IF NOT EXISTS "Order_orderNumber_idx" ON "Order"("orderNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "OrderItem_orderId_goatId_idx" ON "OrderItem"("orderId", "goatId");
