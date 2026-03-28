-- CreateTable
CREATE TABLE "Dog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "breed" TEXT,
    "dob" DATETIME,
    "weight" REAL,
    "sex" TEXT,
    "notes" TEXT,
    "avatarUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CareRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dogId" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "durationMins" INTEGER,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CareRecord_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FeedPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dogId" TEXT NOT NULL,
    "foodName" TEXT NOT NULL,
    "brand" TEXT,
    "amountGrams" REAL NOT NULL,
    "frequency" TEXT NOT NULL,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FeedPlan_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FeedRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dogId" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "foodName" TEXT NOT NULL,
    "amountGrams" REAL NOT NULL,
    "mealTime" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FeedRecord_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HealthRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dogId" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "vetName" TEXT,
    "nextDueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HealthRecord_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dogId" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "notes" TEXT,
    "careRecordId" TEXT,
    "feedRecordId" TEXT,
    "healthRecordId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Expense_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Expense_careRecordId_fkey" FOREIGN KEY ("careRecordId") REFERENCES "CareRecord" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Expense_feedRecordId_fkey" FOREIGN KEY ("feedRecordId") REFERENCES "FeedRecord" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Expense_healthRecordId_fkey" FOREIGN KEY ("healthRecordId") REFERENCES "HealthRecord" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
