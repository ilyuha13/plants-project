/*
  Warnings:

  - You are about to drop the column `genus` on the `Plant` table. All the data in the column will be lost.
  - Added the required column `genusId` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lifeFormId` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variegationId` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PlantInstance` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- DropIndex
DROP INDEX "Plant_genus_idx";

-- AlterTable
ALTER TABLE "Plant" DROP COLUMN "genus",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "genusId" TEXT NOT NULL,
ADD COLUMN     "lifeFormId" TEXT NOT NULL,
ADD COLUMN     "variegationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PlantInstance" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Genus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Genus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variegation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Variegation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LifeForm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LifeForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerAddress" TEXT NOT NULL,
    "vkContact" TEXT,
    "telegramContact" TEXT,
    "customerNotes" TEXT,
    "totalAmount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "plantInstanceId" TEXT NOT NULL,
    "priceAtPurchase" TEXT NOT NULL,
    "plantNameSnapshot" TEXT NOT NULL,
    "plantGenusSnapshot" TEXT NOT NULL,
    "inventoryNumberSnapshot" TEXT NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Genus_name_key" ON "Genus"("name");

-- CreateIndex
CREATE INDEX "Genus_name_idx" ON "Genus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Variegation_name_key" ON "Variegation"("name");

-- CreateIndex
CREATE INDEX "Variegation_name_idx" ON "Variegation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LifeForm_name_key" ON "LifeForm"("name");

-- CreateIndex
CREATE INDEX "LifeForm_name_idx" ON "LifeForm"("name");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_plantInstanceId_idx" ON "OrderItem"("plantInstanceId");

-- CreateIndex
CREATE INDEX "CartItem_cartId_idx" ON "CartItem"("cartId");

-- CreateIndex
CREATE INDEX "CartItem_plantInstanceId_idx" ON "CartItem"("plantInstanceId");

-- CreateIndex
CREATE INDEX "Plant_genusId_idx" ON "Plant"("genusId");

-- CreateIndex
CREATE INDEX "Plant_variegationId_idx" ON "Plant"("variegationId");

-- CreateIndex
CREATE INDEX "Plant_lifeFormId_idx" ON "Plant"("lifeFormId");

-- CreateIndex
CREATE INDEX "Plant_name_idx" ON "Plant"("name");

-- CreateIndex
CREATE INDEX "PlantInstance_status_idx" ON "PlantInstance"("status");

-- CreateIndex
CREATE INDEX "PlantInstance_plantId_idx" ON "PlantInstance"("plantId");

-- CreateIndex
CREATE INDEX "PlantInstance_reservedUntil_idx" ON "PlantInstance"("reservedUntil");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_genusId_fkey" FOREIGN KEY ("genusId") REFERENCES "Genus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_variegationId_fkey" FOREIGN KEY ("variegationId") REFERENCES "Variegation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_lifeFormId_fkey" FOREIGN KEY ("lifeFormId") REFERENCES "LifeForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_plantInstanceId_fkey" FOREIGN KEY ("plantInstanceId") REFERENCES "PlantInstance"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
