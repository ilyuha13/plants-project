/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Plant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Plant" DROP CONSTRAINT "Plant_categoryId_fkey";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Plant";

-- CreateTable
CREATE TABLE "Genus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mainImageUrl" TEXT NOT NULL,
    "imagesUrl" TEXT[],

    CONSTRAINT "Genus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantIntance" (
    "instancePlantId" TEXT NOT NULL,
    "mainImageUrl" TEXT NOT NULL,
    "imagesUrl" TEXT[],
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "genusId" TEXT NOT NULL,

    CONSTRAINT "PlantIntance_pkey" PRIMARY KEY ("instancePlantId")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlantIntance_instancePlantId_key" ON "PlantIntance"("instancePlantId");

-- AddForeignKey
ALTER TABLE "PlantIntance" ADD CONSTRAINT "PlantIntance_genusId_fkey" FOREIGN KEY ("genusId") REFERENCES "Genus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
