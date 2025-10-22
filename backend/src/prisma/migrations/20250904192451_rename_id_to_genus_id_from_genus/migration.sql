/*
  Warnings:

  - The primary key for the `Genus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Genus` table. All the data in the column will be lost.
  - The required column `genusId` was added to the `Genus` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "PlantInstance" DROP CONSTRAINT "PlantInstance_genusId_fkey";

-- AlterTable
ALTER TABLE "Genus" DROP CONSTRAINT "Genus_pkey",
DROP COLUMN "id",
ADD COLUMN     "genusId" TEXT NOT NULL,
ADD CONSTRAINT "Genus_pkey" PRIMARY KEY ("genusId");

-- AddForeignKey
ALTER TABLE "PlantInstance" ADD CONSTRAINT "PlantInstance_genusId_fkey" FOREIGN KEY ("genusId") REFERENCES "Genus"("genusId") ON DELETE RESTRICT ON UPDATE CASCADE;
