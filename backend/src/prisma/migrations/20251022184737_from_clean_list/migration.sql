/*
  Warnings:

  - You are about to drop the column `varietyId` on the `Plant` table. All the data in the column will be lost.
  - You are about to drop the `Species` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Variety` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `genus` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variety` to the `Plant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Plant" DROP CONSTRAINT "Plant_varietyId_fkey";

-- DropForeignKey
ALTER TABLE "Variety" DROP CONSTRAINT "Variety_speciesId_fkey";

-- AlterTable
ALTER TABLE "Plant" DROP COLUMN "varietyId",
ADD COLUMN     "genus" TEXT NOT NULL,
ADD COLUMN     "variety" TEXT NOT NULL;

-- DropTable
DROP TABLE "Species";

-- DropTable
DROP TABLE "Variety";
