/*
  Warnings:

  - You are about to drop the column `genusId` on the `PlantInstance` table. All the data in the column will be lost.
  - Added the required column `speciesId` to the `PlantInstance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PlantInstance" DROP CONSTRAINT "PlantInstance_genusId_fkey";

-- AlterTable
ALTER TABLE "PlantInstance" DROP COLUMN "genusId",
ADD COLUMN     "speciesId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PlantInstance" ADD CONSTRAINT "PlantInstance_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("speciesId") ON DELETE RESTRICT ON UPDATE CASCADE;
