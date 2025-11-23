/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Genus` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `LifeForm` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Variegation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Genus" DROP COLUMN "imageUrl",
ADD COLUMN     "imagesUrl" TEXT[];

-- AlterTable
ALTER TABLE "LifeForm" DROP COLUMN "imageUrl",
ADD COLUMN     "imagesUrl" TEXT[];

-- AlterTable
ALTER TABLE "Variegation" DROP COLUMN "imageUrl",
ADD COLUMN     "imagesUrl" TEXT[];
