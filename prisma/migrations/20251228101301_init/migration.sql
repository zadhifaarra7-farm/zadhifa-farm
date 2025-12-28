-- CreateTable
CREATE TABLE "Goat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "registrationCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "currentWeight" REAL NOT NULL,
    "height" REAL,
    "bodyLength" REAL,
    "chestGirth" REAL,
    "coatColor" TEXT,
    "healthStatus" TEXT NOT NULL DEFAULT 'GOOD',
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isReserved" BOOLEAN NOT NULL DEFAULT false,
    "isSold" BOOLEAN NOT NULL DEFAULT false,
    "purposes" TEXT NOT NULL,
    "qualityGrade" TEXT NOT NULL DEFAULT 'STANDARD',
    "basePrice" REAL NOT NULL,
    "dynamicPrice" REAL,
    "pricePerKg" REAL,
    "thumbnailUrl" TEXT,
    "mediaUrls" TEXT NOT NULL DEFAULT '[]',
    "qrCodeUrl" TEXT,
    "penId" TEXT,
    "lineageTree" TEXT,
    "notes" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Goat_penId_fkey" FOREIGN KEY ("penId") REFERENCES "Pen" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WeightRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goatId" TEXT NOT NULL,
    "weight" REAL NOT NULL,
    "measuredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" TEXT NOT NULL DEFAULT 'MANUAL',
    "measuredBy" TEXT,
    "confidence" REAL,
    "notes" TEXT,
    CONSTRAINT "WeightRecord_goatId_fkey" FOREIGN KEY ("goatId") REFERENCES "Goat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vaccination" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goatId" TEXT NOT NULL,
    "vaccineName" TEXT NOT NULL,
    "vaccineBrand" TEXT,
    "batchNumber" TEXT,
    "administeredAt" DATETIME NOT NULL,
    "nextDueDate" DATETIME,
    "dosage" TEXT,
    "route" TEXT,
    "veterinarianId" TEXT,
    "veterinarianName" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vaccination_goatId_fkey" FOREIGN KEY ("goatId") REFERENCES "Goat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HealthCheck" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goatId" TEXT NOT NULL,
    "checkDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkType" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "temperature" REAL,
    "heartRate" INTEGER,
    "respiratoryRate" INTEGER,
    "bodyConditionScore" INTEGER,
    "notes" TEXT,
    "veterinarianName" TEXT,
    "attachments" TEXT NOT NULL DEFAULT '[]',
    CONSTRAINT "HealthCheck_goatId_fkey" FOREIGN KEY ("goatId") REFERENCES "Goat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pen" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "capacity" INTEGER NOT NULL,
    "currentOccupancy" INTEGER NOT NULL DEFAULT 0,
    "penType" TEXT NOT NULL DEFAULT 'STANDARD',
    "cameraUrl" TEXT,
    "cameraStatus" TEXT NOT NULL DEFAULT 'OFFLINE',
    "iotSensorId" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "IoTReading" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "penId" TEXT NOT NULL,
    "temperature" REAL,
    "humidity" REAL,
    "ammonia" REAL,
    "co2Level" REAL,
    "lightIntensity" REAL,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAnomaly" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "IoTReading_penId_fkey" FOREIGN KEY ("penId") REFERENCES "Pen" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL,
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
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "goatId" TEXT NOT NULL,
    "priceAtPurchase" REAL NOT NULL,
    "weightAtPurchase" REAL NOT NULL,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_goatId_fkey" FOREIGN KEY ("goatId") REFERENCES "Goat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SavedGoat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "goatId" TEXT NOT NULL,
    "savedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavedGoat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SavedGoat_goatId_fkey" FOREIGN KEY ("goatId") REFERENCES "Goat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PricePrediction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "predictedDate" DATETIME NOT NULL,
    "avgPricePerKg" REAL NOT NULL,
    "demandLevel" TEXT NOT NULL,
    "seasonalFactor" REAL NOT NULL,
    "daysToIdulAdha" INTEGER,
    "daysToIdulFitri" INTEGER,
    "confidence" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AIRecommendationLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "budget" REAL NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventDate" DATETIME,
    "preferredBreed" TEXT,
    "minWeight" REAL,
    "recommendedGoats" TEXT NOT NULL,
    "topMatch" REAL NOT NULL,
    "clickedGoatId" TEXT,
    "conversionGoatId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'BUYER',
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Goat_registrationCode_key" ON "Goat"("registrationCode");

-- CreateIndex
CREATE INDEX "Goat_breed_gender_isAvailable_idx" ON "Goat"("breed", "gender", "isAvailable");

-- CreateIndex
CREATE INDEX "Goat_dynamicPrice_idx" ON "Goat"("dynamicPrice");

-- CreateIndex
CREATE INDEX "WeightRecord_goatId_measuredAt_idx" ON "WeightRecord"("goatId", "measuredAt");

-- CreateIndex
CREATE INDEX "Vaccination_goatId_administeredAt_idx" ON "Vaccination"("goatId", "administeredAt");

-- CreateIndex
CREATE INDEX "HealthCheck_goatId_checkDate_idx" ON "HealthCheck"("goatId", "checkDate");

-- CreateIndex
CREATE INDEX "Pen_isActive_idx" ON "Pen"("isActive");

-- CreateIndex
CREATE INDEX "IoTReading_penId_recordedAt_idx" ON "IoTReading"("penId", "recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_userId_status_idx" ON "Order"("userId", "status");

-- CreateIndex
CREATE INDEX "Order_orderNumber_idx" ON "Order"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_orderId_goatId_key" ON "OrderItem"("orderId", "goatId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedGoat_userId_goatId_key" ON "SavedGoat"("userId", "goatId");

-- CreateIndex
CREATE INDEX "PricePrediction_predictedDate_idx" ON "PricePrediction"("predictedDate");

-- CreateIndex
CREATE UNIQUE INDEX "PricePrediction_predictedDate_key" ON "PricePrediction"("predictedDate");

-- CreateIndex
CREATE INDEX "AIRecommendationLog_sessionId_idx" ON "AIRecommendationLog"("sessionId");

-- CreateIndex
CREATE INDEX "AIRecommendationLog_createdAt_idx" ON "AIRecommendationLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
