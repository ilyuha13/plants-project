/*
  Warnings:

  - Added the required column `lifeForm` to the `Genus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variability` to the `Genus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Genus" ADD COLUMN     "lifeForm" TEXT NOT NULL,
ADD COLUMN     "variability" TEXT NOT NULL;
