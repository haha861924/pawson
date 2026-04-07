-- AlterTable: Replace imageUrl with imageUrls array
ALTER TABLE "Discussion" ADD COLUMN "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Migrate existing data
UPDATE "Discussion" SET "imageUrls" = ARRAY["imageUrl"] WHERE "imageUrl" IS NOT NULL;

-- Drop old column
ALTER TABLE "Discussion" DROP COLUMN "imageUrl";
