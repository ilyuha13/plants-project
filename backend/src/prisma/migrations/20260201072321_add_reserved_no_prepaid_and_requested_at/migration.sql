/*
  Warnings:

  - The values [REQUESTED_NO_PREPAID] on the enum `ReservationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReservationType_new" AS ENUM ('AUTOMATIC', 'RESERVED_NO_PREPAID', 'REQUESTED_PREPAID');
ALTER TABLE "public"."Cart" ALTER COLUMN "reservationType" DROP DEFAULT;
ALTER TABLE "Cart" ALTER COLUMN "reservationType" TYPE "ReservationType_new" USING ("reservationType"::text::"ReservationType_new");
ALTER TYPE "ReservationType" RENAME TO "ReservationType_old";
ALTER TYPE "ReservationType_new" RENAME TO "ReservationType";
DROP TYPE "public"."ReservationType_old";
ALTER TABLE "Cart" ALTER COLUMN "reservationType" SET DEFAULT 'AUTOMATIC';
COMMIT;

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "requestedAt" TIMESTAMP(3);
