-- CreateTable
CREATE TABLE "places" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "advertiser_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "home_team" TEXT NOT NULL,
    "away_team" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "match_date" TIMESTAMP(3) NOT NULL,
    "phase" TEXT NOT NULL,
    "home_score" INTEGER,
    "away_score" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "ad_impressions" ADD COLUMN "placement" TEXT;

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_advertiser_id_fkey" FOREIGN KEY ("advertiser_id") REFERENCES "advertisers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
