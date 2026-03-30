-- Rename Dog table to Pet
ALTER TABLE "Dog" RENAME TO "Pet";

-- Add species column with default 'dog' for existing records
ALTER TABLE "Pet" ADD COLUMN "species" TEXT NOT NULL DEFAULT 'dog';

-- Rename DogMember table to PetMember
ALTER TABLE "DogMember" RENAME TO "PetMember";

-- Rename dogId columns to petId in all related tables
ALTER TABLE "CareRecord" RENAME COLUMN "dogId" TO "petId";
ALTER TABLE "FeedPlan" RENAME COLUMN "dogId" TO "petId";
ALTER TABLE "FeedRecord" RENAME COLUMN "dogId" TO "petId";
ALTER TABLE "FeedReview" RENAME COLUMN "dogId" TO "petId";
ALTER TABLE "HealthRecord" RENAME COLUMN "dogId" TO "petId";
ALTER TABLE "Expense" RENAME COLUMN "dogId" TO "petId";
ALTER TABLE "WeightRecord" RENAME COLUMN "dogId" TO "petId";
ALTER TABLE "DailyHealthLog" RENAME COLUMN "dogId" TO "petId";
ALTER TABLE "PetMember" RENAME COLUMN "dogId" TO "petId";

-- Rename unique indexes
ALTER INDEX "DogMember_dogId_userId_key" RENAME TO "PetMember_petId_userId_key";
ALTER INDEX "DailyHealthLog_dogId_date_idx" RENAME TO "DailyHealthLog_petId_date_idx";

-- Drop old foreign key constraints and recreate pointing to Pet table
ALTER TABLE "CareRecord" DROP CONSTRAINT "CareRecord_dogId_fkey";
ALTER TABLE "CareRecord" ADD CONSTRAINT "CareRecord_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "FeedPlan" DROP CONSTRAINT "FeedPlan_dogId_fkey";
ALTER TABLE "FeedPlan" ADD CONSTRAINT "FeedPlan_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "FeedRecord" DROP CONSTRAINT "FeedRecord_dogId_fkey";
ALTER TABLE "FeedRecord" ADD CONSTRAINT "FeedRecord_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "FeedReview" DROP CONSTRAINT "FeedReview_dogId_fkey";
ALTER TABLE "FeedReview" ADD CONSTRAINT "FeedReview_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "HealthRecord" DROP CONSTRAINT "HealthRecord_dogId_fkey";
ALTER TABLE "HealthRecord" ADD CONSTRAINT "HealthRecord_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Expense" DROP CONSTRAINT "Expense_dogId_fkey";
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WeightRecord" DROP CONSTRAINT "WeightRecord_dogId_fkey";
ALTER TABLE "WeightRecord" ADD CONSTRAINT "WeightRecord_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DailyHealthLog" DROP CONSTRAINT "DailyHealthLog_dogId_fkey";
ALTER TABLE "DailyHealthLog" ADD CONSTRAINT "DailyHealthLog_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PetMember" DROP CONSTRAINT "DogMember_dogId_fkey";
ALTER TABLE "PetMember" ADD CONSTRAINT "PetMember_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PetMember" DROP CONSTRAINT "DogMember_userId_fkey";
ALTER TABLE "PetMember" ADD CONSTRAINT "PetMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
