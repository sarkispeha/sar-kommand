/*
  Warnings:

  - Added the required column `memberId` to the `MemberCoord` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- Insert a default member
INSERT INTO "Member" (id) VALUES (1);

-- AlterTable
ALTER TABLE "MemberCoord" ADD COLUMN "memberId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "MemberCoord" ADD CONSTRAINT "MemberCoord_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Remove the default after the migration
ALTER TABLE "MemberCoord" ALTER COLUMN "memberId" DROP DEFAULT;