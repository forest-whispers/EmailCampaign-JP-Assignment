-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('GOOGLE', 'FACEBOOK', 'LINKEDIN', 'DIRECTORY', 'WEBSITE', 'CSV', 'OTHER');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('VALID', 'INVALID', 'MISSING');

-- CreateEnum
CREATE TYPE "Classification" AS ENUM ('BUSINESS', 'INDIVIDUAL');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "buyerName" TEXT,
    "companyName" TEXT,
    "email" TEXT,
    "website" TEXT,
    "country" TEXT,
    "source" "LeadSource" NOT NULL,
    "emailStatus" "EmailStatus" NOT NULL,
    "classification" "Classification",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email");
