-- AlterTable
ALTER TABLE "Expense" ADD COLUMN "invoiceNumber" TEXT;

-- AlterTable
ALTER TABLE "HealthRecord" ADD COLUMN "reminderInterval" TEXT;

-- CreateTable
CREATE TABLE "FeedReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dogId" TEXT NOT NULL,
    "foodName" TEXT NOT NULL,
    "brand" TEXT,
    "rating" INTEGER NOT NULL,
    "review" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FeedReview_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
