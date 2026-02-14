/*
  Warnings:

  - The values [AWAITING_PAYMENT] on the enum `PlantStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PlantStatus_new" AS ENUM ('AVAILABLE', 'IN_CART', 'SOLD');
ALTER TABLE "public"."PlantInstance" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "PlantInstance" ALTER COLUMN "status" TYPE "PlantStatus_new" USING ("status"::text::"PlantStatus_new");
ALTER TYPE "PlantStatus" RENAME TO "PlantStatus_old";
ALTER TYPE "PlantStatus_new" RENAME TO "PlantStatus";
DROP TYPE "public"."PlantStatus_old";
ALTER TABLE "PlantInstance" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';
COMMIT;
