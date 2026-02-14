/*
  Warnings:

  - The values [REQUESTED_PREPAID] on the enum `ReservationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReservationType_new" AS ENUM ('AUTOMATIC', 'RESERVED_NO_PREPAID', 'RESERVED_PREPAID_REQUEST', 'RESERVED_PREPAID_CONFIRMED');
ALTER TABLE "public"."Cart" ALTER COLUMN "reservationType" DROP DEFAULT;
ALTER TABLE "Cart" ALTER COLUMN "reservationType" TYPE "ReservationType_new" USING ("reservationType"::text::"ReservationType_new");
ALTER TYPE "ReservationType" RENAME TO "ReservationType_old";
ALTER TYPE "ReservationType_new" RENAME TO "ReservationType";
DROP TYPE "public"."ReservationType_old";
ALTER TABLE "Cart" ALTER COLUMN "reservationType" SET DEFAULT 'AUTOMATIC';
COMMIT;
