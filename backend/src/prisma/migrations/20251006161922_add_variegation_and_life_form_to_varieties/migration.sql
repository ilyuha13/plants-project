/*
  Warnings:

  - Added the required column `lifeForm` to the `Varieties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variegation` to the `Varieties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Varieties" ADD COLUMN     "lifeForm" TEXT NOT NULL,
ADD COLUMN     "variegation" TEXT NOT NULL;
