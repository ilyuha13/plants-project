/*
  Warnings:

  - The primary key for the `Plant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `plantInstanceId` on the `Plant` table. All the data in the column will be lost.
  - You are about to drop the column `varietiesId` on the `Plant` table. All the data in the column will be lost.
  - The primary key for the `Variety` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `varietiesId` on the `Variety` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[plantId]` on the table `Plant` will be added. If there are existing duplicate values, this will fail.
  - The required column `plantId` was added to the `Plant` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `varietyId` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - The required column `varietyId` was added to the `Variety` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Plant" DROP CONSTRAINT "Plant_varietiesId_fkey";

-- DropIndex
DROP INDEX "Plant_plantInstanceId_key";

-- AlterTable
ALTER TABLE "Plant" DROP CONSTRAINT "Plant_pkey",
DROP COLUMN "plantInstanceId",
DROP COLUMN "varietiesId",
ADD COLUMN     "plantId" TEXT NOT NULL,
ADD COLUMN     "varietyId" TEXT NOT NULL,
ADD CONSTRAINT "Plant_pkey" PRIMARY KEY ("plantId");

-- AlterTable
ALTER TABLE "Variety" DROP CONSTRAINT "Variety_pkey",
DROP COLUMN "varietiesId",
ADD COLUMN     "varietyId" TEXT NOT NULL,
ADD CONSTRAINT "Variety_pkey" PRIMARY KEY ("varietyId");

-- CreateIndex
CREATE UNIQUE INDEX "Plant_plantId_key" ON "Plant"("plantId");

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_varietyId_fkey" FOREIGN KEY ("varietyId") REFERENCES "Variety"("varietyId") ON DELETE RESTRICT ON UPDATE CASCADE;
