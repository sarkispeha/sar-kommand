-- DropForeignKey
ALTER TABLE "GpxFile" DROP CONSTRAINT "GpxFile_memberId_fkey";

-- DropForeignKey
ALTER TABLE "MemberCoord" DROP CONSTRAINT "MemberCoord_sarMemberId_fkey";

-- AddForeignKey
ALTER TABLE "MemberCoord" ADD CONSTRAINT "MemberCoord_sarMemberId_fkey" FOREIGN KEY ("sarMemberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GpxFile" ADD CONSTRAINT "GpxFile_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
