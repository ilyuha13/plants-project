/*
  Warnings:

  - You are about to drop the column `imageSrc` on the `Plant` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `Plant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plant" DROP COLUMN "imageSrc",
ADD COLUMN     "imageUrl" TEXT NOT NULL;
