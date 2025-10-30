-- DropForeignKey
ALTER TABLE "PlantInstance" DROP CONSTRAINT "PlantInstance_plantId_fkey";

-- AddForeignKey
ALTER TABLE "PlantInstance" ADD CONSTRAINT "PlantInstance_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("plantId") ON DELETE CASCADE ON UPDATE CASCADE;
