 BEGIN;

  -- ============================================
  -- ЧАСТЬ 1: Plant.plantId → id
  -- ============================================

  -- Переименовать колонку (foreign keys обновятся автоматически)
  ALTER TABLE "Plant" RENAME COLUMN "plantId" TO "id";

  -- ============================================
  -- ЧАСТЬ 2: PlantInstance.Id → id
  -- ============================================

  -- Переименовать колонку (foreign keys обновятся автоматически)
  ALTER TABLE "PlantInstance" RENAME COLUMN "Id" TO "id";

  -- ============================================
  -- ЧАСТЬ 3: PlantInstance.price String → Decimal
  -- ============================================

  -- Шаг 1: Создать временную колонку
  ALTER TABLE "PlantInstance" ADD COLUMN "price_new" DECIMAL(10, 2);

  -- Шаг 2: Скопировать данные с конвертацией
  -- Защита от невалидных значений
  UPDATE "PlantInstance"
  SET "price_new" = CASE
    WHEN "price" ~ '^[0-9]+\.?[0-9]*$' THEN CAST("price" AS DECIMAL(10, 2))
    ELSE 0.00
  END;

  -- Шаг 3: Проверить, что нет NULL
  ALTER TABLE "PlantInstance" ALTER COLUMN "price_new" SET NOT NULL;

  -- Шаг 4: Удалить старую колонку
  ALTER TABLE "PlantInstance" DROP COLUMN "price";

  -- Шаг 5: Переименовать новую колонку
  ALTER TABLE "PlantInstance" RENAME COLUMN "price_new" TO "price";

  -- ============================================
  -- ЧАСТЬ 4: Order.totalAmount String → Decimal
  -- ============================================

  -- Аналогично для заказов
  ALTER TABLE "Order" ADD COLUMN "totalAmount_new" DECIMAL(10, 2);

  UPDATE "Order"
  SET "totalAmount_new" = CASE
    WHEN "totalAmount" ~ '^[0-9]+\.?[0-9]*$' THEN CAST("totalAmount" AS
  DECIMAL(10, 2))
    ELSE 0.00
  END;

  ALTER TABLE "Order" ALTER COLUMN "totalAmount_new" SET NOT NULL;
  ALTER TABLE "Order" DROP COLUMN "totalAmount";
  ALTER TABLE "Order" RENAME COLUMN "totalAmount_new" TO "totalAmount";

  COMMIT;