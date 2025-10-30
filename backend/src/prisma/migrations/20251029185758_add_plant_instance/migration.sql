-- CreateTable
CREATE TABLE "PlantInstance" (
    "Id" TEXT NOT NULL,
    "inventoryNumber" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "description" TEXT,
    "imagesUrl" TEXT[],
    "price" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlantInstance_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlantInstance_Id_key" ON "PlantInstance"("Id");

-- CreateIndex
CREATE UNIQUE INDEX "PlantInstance_inventoryNumber_key" ON "PlantInstance"("inventoryNumber");

-- AddForeignKey
ALTER TABLE "PlantInstance" ADD CONSTRAINT "PlantInstance_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("plantId") ON DELETE RESTRICT ON UPDATE CASCADE;
