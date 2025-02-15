/*
  Warnings:

  - You are about to drop the column `memberId` on the `MemberCoord` table. All the data in the column will be lost.
  - Added the required column `sarMemberId` to the `MemberCoord` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable (if Member table doesn't exist yet)
CREATE TABLE IF NOT EXISTS "Member" (
    "id" SERIAL NOT NULL,
    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- Insert a default member if not exists
INSERT INTO "Member" (id) 
SELECT 1 
WHERE NOT EXISTS (SELECT * FROM "Member" WHERE id = 1);

-- Drop the foreign key constraint
ALTER TABLE "MemberCoord" DROP CONSTRAINT IF EXISTS "MemberCoord_memberId_fkey";

-- Rename column (this preserves the data)
ALTER TABLE "MemberCoord" RENAME COLUMN "memberId" TO "sarMemberId";

-- Add default value temporarily
ALTER TABLE "MemberCoord" ALTER COLUMN "sarMemberId" SET DEFAULT 1;

-- Update any null values to use default member
UPDATE "MemberCoord" SET "sarMemberId" = 1 WHERE "sarMemberId" IS NULL;

-- Set NOT NULL constraint
ALTER TABLE "MemberCoord" ALTER COLUMN "sarMemberId" SET NOT NULL;

-- Remove default value
ALTER TABLE "MemberCoord" ALTER COLUMN "sarMemberId" DROP DEFAULT;

-- Add foreign key constraint
ALTER TABLE "MemberCoord" ADD CONSTRAINT "MemberCoord_sarMemberId_fkey" 
    FOREIGN KEY ("sarMemberId") REFERENCES "Member"("id") 
    ON DELETE RESTRICT ON UPDATE CASCADE;