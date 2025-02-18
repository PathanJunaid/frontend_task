-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "groupMessage" (
    "id" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groupMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "groupMessage" ADD CONSTRAINT "groupMessage_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupMessage" ADD CONSTRAINT "groupMessage_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
