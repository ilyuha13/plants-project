/*
  Warnings:

  - The primary key for the `PlantInstance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `PlanInstancetId` on the `PlantInstance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[PlantInstanceId]` on the table `PlantInstance` will be added. If there are existing duplicate values, this will fail.
  - The required column `PlantInstanceId` was added to the `PlantInstance` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "PlantInstance_PlanInstancetId_key";

-- AlterTable
ALTER TABLE "PlantInstance" DROP CONSTRAINT "PlantInstance_pkey",
DROP COLUMN "PlanInstancetId",
ADD COLUMN     "PlantInstanceId" TEXT NOT NULL,
ADD CONSTRAINT "PlantInstance_pkey" PRIMARY KEY ("PlantInstanceId");

-- CreateIndex
CREATE UNIQUE INDEX "PlantInstance_PlantInstanceId_key" ON "PlantInstance"("PlantInstanceId");
