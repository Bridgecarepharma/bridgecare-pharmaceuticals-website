CREATE TABLE "ShippingZone" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "priceKobo" INTEGER NOT NULL,
  "states" JSONB NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ShippingZone_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ShippingZone_code_key" ON "ShippingZone"("code");
CREATE INDEX "ShippingZone_isActive_sortOrder_idx" ON "ShippingZone"("isActive", "sortOrder");

CREATE TABLE "ShippingSetting" (
  "id" TEXT NOT NULL,
  "freeShippingPackCount" INTEGER NOT NULL DEFAULT 3,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ShippingSetting_pkey" PRIMARY KEY ("id")
);
