ALTER TABLE "Inventory" ADD COLUMN "priceKobo" INTEGER NOT NULL DEFAULT 0;

UPDATE "Inventory" SET "priceKobo" = CASE "productSlug"
  WHEN 'aspivit' THEN 800000
  WHEN 'asfenositol' THEN 600000
  WHEN 'globivida' THEN 1500000
  WHEN 'herbal-bitter-tea' THEN 550000
  ELSE 0
END;
