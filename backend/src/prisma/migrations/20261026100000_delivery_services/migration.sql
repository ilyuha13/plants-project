-- Preserve legacy values on existing records; require an explicit service for new paid orders.
ALTER TYPE "DeliveryType" ADD VALUE 'CITY';
ALTER TYPE "DeliveryType" ADD VALUE 'FIVEPOST';
ALTER TYPE "DeliveryType" ADD VALUE 'CDEK';
ALTER TYPE "DeliveryType" ADD VALUE 'POST';
ALTER TYPE "DeliveryType" ADD VALUE 'OZON';
