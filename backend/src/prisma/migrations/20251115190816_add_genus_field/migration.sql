/*
  Warnings:

  - Added the required column `genus` to the `Plant` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add column as nullable first
ALTER TABLE "Plant" ADD COLUMN "genus" TEXT;

-- Step 2: Fill genus from existing name (extract first word)
-- Example: "Сингониум Империал" -> genus="Сингониум", name="Сингониум Империал"
UPDATE "Plant"
SET "genus" = SPLIT_PART("name", ' ', 1)
WHERE "genus" IS NULL;

-- Step 3: Make genus required (NOT NULL)
ALTER TABLE "Plant" ALTER COLUMN "genus" SET NOT NULL;

-- Step 4: Create index for fast sorting/filtering
CREATE INDEX "Plant_genus_idx" ON "Plant"("genus");
