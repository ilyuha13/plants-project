-- Keep historical full names unchanged; do not guess which word is a given name.
ALTER TABLE "User" ADD COLUMN "customerFirstName" TEXT, ADD COLUMN "customerLastName" TEXT, ADD COLUMN "customerPatronymic" TEXT;
ALTER TABLE "Cart" ADD COLUMN "customerFirstName" TEXT, ADD COLUMN "customerLastName" TEXT, ADD COLUMN "customerPatronymic" TEXT;
ALTER TABLE "Order" ADD COLUMN "customerFirstName" TEXT, ADD COLUMN "customerLastName" TEXT, ADD COLUMN "customerPatronymic" TEXT;
