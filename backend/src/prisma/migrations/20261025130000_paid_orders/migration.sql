CREATE TYPE "DeliveryType" AS ENUM ('PICKUP', 'PVZ', 'ADDRESS', 'OTHER');
ALTER TABLE "Cart"
ADD COLUMN "purchaseRequestedAt" TIMESTAMP(3),
ADD COLUMN "customerPhone" TEXT,
ADD COLUMN "deliveryType" "DeliveryType",
ADD COLUMN "deliveryAddress" TEXT,
ADD COLUMN "pickupPoint" TEXT,
ADD COLUMN "deliveryNotes" TEXT;
ALTER TABLE "Order"
ADD COLUMN "paidAmount" DECIMAL(65,30),
ADD COLUMN "prepaidAmount" DECIMAL(65,30),
ADD COLUMN "sourceCartId" TEXT,
ADD COLUMN "customerContact" TEXT,
ADD COLUMN "deliveryType" "DeliveryType",
ADD COLUMN "deliveryCost" DECIMAL(65,30),
ADD COLUMN "pickupPoint" TEXT,
ADD COLUMN "deliveryNotes" TEXT;
-- Historical values cannot be reconstructed reliably. Only new orders get snapshots.
ALTER TABLE "OrderItem"
ADD COLUMN "plantName" TEXT,
ADD COLUMN "inventoryNumber" TEXT,
ADD COLUMN "unitPrice" DECIMAL(65,30),
ADD COLUMN "imagesUrl" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
