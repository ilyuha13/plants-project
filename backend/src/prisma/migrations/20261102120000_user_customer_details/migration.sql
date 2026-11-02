ALTER TABLE "User"
ADD COLUMN "customerName" TEXT,
ADD COLUMN "customerContact" TEXT,
ADD COLUMN "customerPhone" TEXT,
ADD COLUMN "customerTelegram" TEXT,
ADD COLUMN "reservationComment" TEXT,
ADD COLUMN "deliveryType" "DeliveryType",
ADD COLUMN "deliveryAddress" TEXT,
ADD COLUMN "pickupPoint" TEXT,
ADD COLUMN "deliveryNotes" TEXT;
