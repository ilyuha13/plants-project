/*
  Warnings:

  - You are about to drop the column `lifeForm` on the `Species` table. All the data in the column will be lost.
  - You are about to drop the column `variability` on the `Species` table. All the data in the column will be lost.
  - You are about to drop the `PlantInstance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlantInstance" DROP CONSTRAINT "PlantInstance_speciesId_fkey";

-- AlterTable
ALTER TABLE "Species" DROP COLUMN "lifeForm",
DROP COLUMN "variability";

-- DropTable
DROP TABLE "PlantInstance";

-- CreateTable
CREATE TABLE "Varieties" (
    "varietiesId" TEXT NOT NULL,
    "speciesId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imagesUrl" TEXT[],

    CONSTRAINT "Varieties_pkey" PRIMARY KEY ("varietiesId")
);

-- CreateTable
CREATE TABLE "Plant" (
    "plantInstanceId" TEXT NOT NULL,
    "varietiesId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imagesUrl" TEXT[],
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("plantInstanceId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plant_plantInstanceId_key" ON "Plant"("plantInstanceId");

-- AddForeignKey
ALTER TABLE "Varieties" ADD CONSTRAINT "Varieties_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("speciesId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_varietiesId_fkey" FOREIGN KEY ("varietiesId") REFERENCES "Varieties"("varietiesId") ON DELETE RESTRICT ON UPDATE CASCADE;
