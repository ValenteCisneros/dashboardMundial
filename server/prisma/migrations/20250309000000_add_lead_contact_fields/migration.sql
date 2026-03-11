-- AlterTable
ALTER TABLE "leads" ADD COLUMN "email" TEXT;
ALTER TABLE "leads" ADD COLUMN "first_name" TEXT;
ALTER TABLE "leads" ADD COLUMN "last_name" TEXT;
ALTER TABLE "leads" ADD COLUMN "phone" TEXT;
ALTER TABLE "leads" ADD COLUMN "consent_newsletter" BOOLEAN NOT NULL DEFAULT false;
