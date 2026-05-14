/*
  Warnings:

  - A unique constraint covering the columns `[websiteId,date]` on the table `DailyStat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[websiteId,path]` on the table `PageStat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "language" TEXT,
ADD COLUMN     "screenHeight" INTEGER,
ADD COLUMN     "screenWidth" INTEGER,
ADD COLUMN     "timezone" TEXT;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "currentPeriodEnd" TIMESTAMP(3),
ADD COLUMN     "razorpayOrderId" TEXT,
ADD COLUMN     "razorpayPaymentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "DailyStat_websiteId_date_key" ON "DailyStat"("websiteId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "PageStat_websiteId_path_key" ON "PageStat"("websiteId", "path");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");
