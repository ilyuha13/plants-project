ALTER TABLE "User" ADD COLUMN "customerVk" TEXT;
ALTER TABLE "Cart" ADD COLUMN "customerTelegram" TEXT, ADD COLUMN "customerVk" TEXT;

-- Correct VK links previously saved in the combined messenger field.
UPDATE "User" SET "customerVk" = "customerTelegram", "customerTelegram" = NULL
WHERE "customerTelegram" ~* '(vk\.com|vk\.ru)/';
