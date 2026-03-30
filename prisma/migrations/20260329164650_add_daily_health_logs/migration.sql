-- CreateTable
CREATE TABLE "DailyHealthLog" (
    "id" TEXT NOT NULL,
    "dogId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weight" DOUBLE PRECISION,
    "appetite" TEXT,
    "stoolCondition" TEXT,
    "hasVomiting" BOOLEAN NOT NULL DEFAULT false,
    "mood" TEXT,
    "temperature" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyHealthLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyHealthLog_dogId_date_idx" ON "DailyHealthLog"("dogId", "date");

-- AddForeignKey
ALTER TABLE "DailyHealthLog" ADD CONSTRAINT "DailyHealthLog_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
