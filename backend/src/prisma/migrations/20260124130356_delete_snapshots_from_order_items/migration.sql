/*
  Warnings:

  - You are about to drop the column `inventoryNumberSnapshot` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `plantGenusSnapshot` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `plantNameSnapshot` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `priceAtPurchase` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "inventoryNumberSnapshot",
DROP COLUMN "plantGenusSnapshot",
DROP COLUMN "plantNameSnapshot",
DROP COLUMN "priceAtPurchase";
