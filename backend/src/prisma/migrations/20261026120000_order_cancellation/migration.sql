ALTER TABLE "Order"
ADD COLUMN "cancelledAt" TIMESTAMP(3),
ADD COLUMN "cancellationReason" TEXT,
ADD COLUMN "cancellationRequestId" TEXT,
ADD COLUMN "cancellationPayloadHash" TEXT,
ADD COLUMN "refundedAmount" DECIMAL(65,30) NOT NULL DEFAULT 0;
CREATE UNIQUE INDEX "Order_cancellationRequestId_key" ON "Order"("cancellationRequestId");
ALTER TABLE "OrderItem" ADD COLUMN "releasedAt" TIMESTAMP(3), ADD COLUMN "releasedById" TEXT;
CREATE TABLE "OrderRefund" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "amount" DECIMAL(65,30) NOT NULL,
  "note" TEXT,
  "actorId" TEXT NOT NULL,
  "actorNick" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OrderRefund_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "OrderRefund_orderId_createdAt_idx" ON "OrderRefund"("orderId", "createdAt");
