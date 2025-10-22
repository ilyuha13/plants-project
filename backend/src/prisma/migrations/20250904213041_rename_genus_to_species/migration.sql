/*
  Warnings:

  - You are about to drop the `Genus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlantInstance" DROP CONSTRAINT "PlantInstance_genusId_fkey";

-- DropTable
DROP TABLE "Genus";

-- CreateTable
CREATE TABLE "Species" (
    "genusId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "variability" TEXT NOT NULL,
    "lifeForm" TEXT NOT NULL,
    "imagesUrl" TEXT[],

    CONSTRAINT "Species_pkey" PRIMARY KEY ("genusId")
);

-- AddForeignKey
ALTER TABLE "PlantInstance" ADD CONSTRAINT "PlantInstance_genusId_fkey" FOREIGN KEY ("genusId") REFERENCES "Species"("genusId") ON DELETE RESTRICT ON UPDATE CASCADE;
