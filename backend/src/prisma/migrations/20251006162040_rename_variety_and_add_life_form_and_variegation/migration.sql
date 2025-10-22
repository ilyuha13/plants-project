/*
  Warnings:

  - You are about to drop the `Varieties` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Plant" DROP CONSTRAINT "Plant_varietiesId_fkey";

-- DropForeignKey
ALTER TABLE "Varieties" DROP CONSTRAINT "Varieties_speciesId_fkey";

-- DropTable
DROP TABLE "Varieties";

-- CreateTable
CREATE TABLE "Variety" (
    "varietiesId" TEXT NOT NULL,
    "speciesId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lifeForm" TEXT NOT NULL,
    "variegation" TEXT NOT NULL,
    "imagesUrl" TEXT[],

    CONSTRAINT "Variety_pkey" PRIMARY KEY ("varietiesId")
);

-- AddForeignKey
ALTER TABLE "Variety" ADD CONSTRAINT "Variety_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("speciesId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_varietiesId_fkey" FOREIGN KEY ("varietiesId") REFERENCES "Variety"("varietiesId") ON DELETE RESTRICT ON UPDATE CASCADE;
