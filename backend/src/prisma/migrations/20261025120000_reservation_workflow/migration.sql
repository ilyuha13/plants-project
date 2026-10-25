ALTER TABLE "Cart"
ADD COLUMN "customerName" TEXT,
ADD COLUMN "customerContact" TEXT,
ADD COLUMN "customerComment" TEXT,
ADD COLUMN "adminComment" TEXT,
ADD COLUMN "reviewAt" TIMESTAMP(3);

-- Existing free reservations are confirmed reservations with zero prepayment.
UPDATE "Cart" SET "reservationType" = 'RESERVED_PREPAID_CONFIRMED',
"prepaidAmount" = COALESCE("prepaidAmount", 0)
WHERE "reservationType" = 'RESERVED_NO_PREPAID';
UPDATE "Cart" SET "reviewAt" = "reservedUntil"
WHERE "reservationType" = 'RESERVED_PREPAID_CONFIRMED';
UPDATE "Cart" SET "reservedUntil" = NULL
WHERE "reservationType" = 'RESERVED_PREPAID_REQUEST';
CREATE INDEX "Cart_reservationType_reviewAt_idx" ON "Cart"("reservationType", "reviewAt");
