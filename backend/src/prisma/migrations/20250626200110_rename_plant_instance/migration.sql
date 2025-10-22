/*
  Warnings:

  - You are about to drop the `PlantIntance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlantIntance" DROP CONSTRAINT "PlantIntance_genusId_fkey";

-- DropTable
DROP TABLE "PlantIntance";

-- CreateTable
CREATE TABLE "PlantInstance" (
    "instancePlantId" TEXT NOT NULL,
    "mainImageUrl" TEXT NOT NULL,
    "imagesUrl" TEXT[],
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "genusId" TEXT NOT NULL,

    CONSTRAINT "PlantInstance_pkey" PRIMARY KEY ("instancePlantId")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlantInstance_instancePlantId_key" ON "PlantInstance"("instancePlantId");

-- AddForeignKey
ALTER TABLE "PlantInstance" ADD CONSTRAINT "PlantInstance_genusId_fkey" FOREIGN KEY ("genusId") REFERENCES "Genus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
