/*
  Warnings:

  - You are about to drop the column `reservedUntil` on the `PlantInstance` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ReservationType" AS ENUM ('AUTOMATIC', 'REQUESTED_NO_PREPAID', 'REQUESTED_PREPAID');

-- DropIndex
DROP INDEX "Plant_plantId_key";

-- DropIndex
DROP INDEX "PlantInstance_Id_key";

-- DropIndex
DROP INDEX "PlantInstance_reservedUntil_idx";

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "reservationType" "ReservationType" NOT NULL DEFAULT 'AUTOMATIC',
ADD COLUMN     "reservedUntil" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "totalAmount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "PlantInstance" DROP COLUMN "reservedUntil",
ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);
