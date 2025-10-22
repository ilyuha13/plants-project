/*
  Warnings:

  - The primary key for the `Species` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `genusId` on the `Species` table. All the data in the column will be lost.
  - The required column `speciesId` was added to the `Species` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "PlantInstance" DROP CONSTRAINT "PlantInstance_genusId_fkey";

-- AlterTable
ALTER TABLE "Species" DROP CONSTRAINT "Species_pkey",
DROP COLUMN "genusId",
ADD COLUMN     "speciesId" TEXT NOT NULL,
ADD CONSTRAINT "Species_pkey" PRIMARY KEY ("speciesId");

-- AddForeignKey
ALTER TABLE "PlantInstance" ADD CONSTRAINT "PlantInstance_genusId_fkey" FOREIGN KEY ("genusId") REFERENCES "Species"("speciesId") ON DELETE RESTRICT ON UPDATE CASCADE;
