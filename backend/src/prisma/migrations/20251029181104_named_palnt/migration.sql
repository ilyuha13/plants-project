/*
  Warnings:

  - You are about to drop the column `genus` on the `Plant` table. All the data in the column will be lost.
  - You are about to drop the column `inventoryNumber` on the `Plant` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Plant` table. All the data in the column will be lost.
  - You are about to drop the column `variety` on the `Plant` table. All the data in the column will be lost.
  - Added the required column `name` to the `Plant` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Plant_inventoryNumber_key";

-- AlterTable
ALTER TABLE "Plant" DROP COLUMN "genus",
DROP COLUMN "inventoryNumber",
DROP COLUMN "price",
DROP COLUMN "variety",
ADD COLUMN     "name" TEXT NOT NULL;
