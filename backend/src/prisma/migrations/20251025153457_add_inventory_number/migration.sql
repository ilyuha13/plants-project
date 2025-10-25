/*
  Warnings:

  - A unique constraint covering the columns `[inventoryNumber]` on the table `Plant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Plant" ADD COLUMN     "inventoryNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Plant_inventoryNumber_key" ON "Plant"("inventoryNumber");
