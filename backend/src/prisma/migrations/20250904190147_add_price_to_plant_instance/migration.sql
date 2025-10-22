/*
  Warnings:

  - Added the required column `price` to the `PlantInstance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlantInstance" ADD COLUMN     "price" TEXT NOT NULL;
