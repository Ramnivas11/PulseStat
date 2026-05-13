/*
  Warnings:

  - You are about to drop the column `razorpayOrderId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `razorpayPaymentId` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "razorpayOrderId",
DROP COLUMN "razorpayPaymentId",
ADD COLUMN     "paddleCustomerId" TEXT,
ADD COLUMN     "paddlePriceId" TEXT,
ADD COLUMN     "paddleSubscriptionId" TEXT;
