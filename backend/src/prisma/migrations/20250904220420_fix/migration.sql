/*
  Warnings:

  - The primary key for the `PlantInstance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `PlantInstanceId` on the `PlantInstance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[plantInstanceId]` on the table `PlantInstance` will be added. If there are existing duplicate values, this will fail.
  - The required column `plantInstanceId` was added to the `PlantInstance` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "PlantInstance_PlantInstanceId_key";

-- AlterTable
ALTER TABLE "PlantInstance" DROP CONSTRAINT "PlantInstance_pkey",
DROP COLUMN "PlantInstanceId",
ADD COLUMN     "plantInstanceId" TEXT NOT NULL,
ADD CONSTRAINT "PlantInstance_pkey" PRIMARY KEY ("plantInstanceId");

-- CreateIndex
CREATE UNIQUE INDEX "PlantInstance_plantInstanceId_key" ON "PlantInstance"("plantInstanceId");
