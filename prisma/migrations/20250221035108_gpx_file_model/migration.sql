-- CreateTable
CREATE TABLE "GpxFile" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "fileData" BYTEA NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "memberId" INTEGER NOT NULL,

    CONSTRAINT "GpxFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GpxFile" ADD CONSTRAINT "GpxFile_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
