CREATE TABLE "ProductReview" (
    "id" TEXT NOT NULL,
    "productSlug" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "review" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProductReview_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ProductReview_productSlug_isApproved_createdAt_idx"
ON "ProductReview"("productSlug", "isApproved", "createdAt");
CREATE INDEX "ProductReview_isFeatured_isApproved_idx"
ON "ProductReview"("isFeatured", "isApproved");
