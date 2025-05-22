-- CreateTable
CREATE TABLE "Plant" (
    "plantId" TEXT NOT NULL,
    "genus" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("plantId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plant_plantId_key" ON "Plant"("plantId");
