/*
  Warnings:

  - The `purchaseAmount` column on the `FacebookEngagementBottom` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `purchaseAmount` column on the `TiktokEngagementBottom` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "FacebookEngagementBottom" DROP COLUMN "purchaseAmount",
ADD COLUMN     "purchaseAmount" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "TiktokEngagementBottom" DROP COLUMN "purchaseAmount",
ADD COLUMN     "purchaseAmount" DECIMAL(65,30);
