-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'non_binary');

-- CreateEnum
CREATE TYPE "FunnelStage" AS ENUM ('top', 'bottom');

-- CreateEnum
CREATE TYPE "EventSource" AS ENUM ('facebook', 'tiktok');

-- CreateEnum
CREATE TYPE "Referrer" AS ENUM ('newsfeed', 'marketplace', 'groups');

-- CreateEnum
CREATE TYPE "ClickPosition" AS ENUM ('top_left', 'bottom_right', 'center');

-- CreateEnum
CREATE TYPE "Device" AS ENUM ('mobile', 'desktop');

-- CreateEnum
CREATE TYPE "Browser" AS ENUM ('Chrome', 'Firefox', 'Safari');

-- CreateEnum
CREATE TYPE "TiktokDevice" AS ENUM ('Android', 'iOS', 'Desktop');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "source" "EventSource" NOT NULL,
    "funnelStage" "FunnelStage" NOT NULL,
    "eventType" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacebookUser" (
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "FacebookUser_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "TiktokUser" (
    "eventId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,

    CONSTRAINT "TiktokUser_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "FacebookEngagementTop" (
    "eventId" TEXT NOT NULL,
    "actionTime" TIMESTAMP(3) NOT NULL,
    "referrer" "Referrer" NOT NULL,
    "videoId" TEXT,

    CONSTRAINT "FacebookEngagementTop_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "FacebookEngagementBottom" (
    "eventId" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "clickPosition" "ClickPosition" NOT NULL,
    "device" "Device" NOT NULL,
    "browser" "Browser" NOT NULL,
    "purchaseAmount" TEXT,
    "actionTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacebookEngagementBottom_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "TiktokEngagementTop" (
    "eventId" TEXT NOT NULL,
    "watchTime" INTEGER NOT NULL,
    "percentageWatched" INTEGER NOT NULL,
    "device" "TiktokDevice" NOT NULL,
    "country" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,

    CONSTRAINT "TiktokEngagementTop_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "TiktokEngagementBottom" (
    "eventId" TEXT NOT NULL,
    "actionTime" TIMESTAMP(3) NOT NULL,
    "profileId" TEXT,
    "purchasedItem" TEXT,
    "purchaseAmount" TEXT,

    CONSTRAINT "TiktokEngagementBottom_pkey" PRIMARY KEY ("eventId")
);

-- AddForeignKey
ALTER TABLE "FacebookUser" ADD CONSTRAINT "FacebookUser_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TiktokUser" ADD CONSTRAINT "TiktokUser_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacebookEngagementTop" ADD CONSTRAINT "FacebookEngagementTop_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacebookEngagementBottom" ADD CONSTRAINT "FacebookEngagementBottom_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TiktokEngagementTop" ADD CONSTRAINT "TiktokEngagementTop_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TiktokEngagementBottom" ADD CONSTRAINT "TiktokEngagementBottom_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
