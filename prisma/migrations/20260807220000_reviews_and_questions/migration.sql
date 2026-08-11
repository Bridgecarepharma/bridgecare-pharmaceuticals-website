-- Reconcile the initial reviews table with the current Prisma schema.
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED');
CREATE TYPE "QuestionStatus" AS ENUM ('PENDING', 'ANSWERED', 'ARCHIVED');

ALTER TABLE "ProductReview" ADD COLUMN "customerEmail" TEXT NOT NULL DEFAULT '';
ALTER TABLE "ProductReview" ADD COLUMN "city" TEXT;
ALTER TABLE "ProductReview" ADD COLUMN "orderNumber" TEXT;
ALTER TABLE "ProductReview" ADD COLUMN "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "ProductReview" ADD COLUMN "verifiedPurchase" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "ProductReview" ADD COLUMN "adminReply" TEXT;
ALTER TABLE "ProductReview" RENAME COLUMN "review" TO "body";
UPDATE "ProductReview" SET "status" = CASE WHEN "isApproved" THEN 'APPROVED'::"ReviewStatus" ELSE 'PENDING'::"ReviewStatus" END;
DROP INDEX IF EXISTS "ProductReview_productSlug_isApproved_createdAt_idx";
DROP INDEX IF EXISTS "ProductReview_isFeatured_isApproved_idx";
ALTER TABLE "ProductReview" DROP COLUMN "isApproved";

CREATE INDEX "ProductReview_productSlug_status_createdAt_idx" ON "ProductReview"("productSlug", "status", "createdAt");
CREATE INDEX "ProductReview_isFeatured_status_idx" ON "ProductReview"("isFeatured", "status");
CREATE INDEX "ProductReview_customerEmail_productSlug_createdAt_idx" ON "ProductReview"("customerEmail", "productSlug", "createdAt");

CREATE TABLE "ProductReviewImage" (
  "id" TEXT NOT NULL,
  "reviewId" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "altText" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProductReviewImage_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ProductReviewImage_reviewId_sortOrder_idx" ON "ProductReviewImage"("reviewId", "sortOrder");
ALTER TABLE "ProductReviewImage" ADD CONSTRAINT "ProductReviewImage_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "ProductReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "ProductQuestion" (
  "id" TEXT NOT NULL,
  "productSlug" TEXT NOT NULL,
  "productName" TEXT NOT NULL,
  "customerName" TEXT NOT NULL,
  "customerEmail" TEXT NOT NULL,
  "question" TEXT NOT NULL,
  "status" "QuestionStatus" NOT NULL DEFAULT 'PENDING',
  "answer" TEXT,
  "answeredAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProductQuestion_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ProductQuestion_productSlug_status_createdAt_idx" ON "ProductQuestion"("productSlug", "status", "createdAt");
CREATE INDEX "ProductQuestion_status_createdAt_idx" ON "ProductQuestion"("status", "createdAt");
CREATE INDEX "ProductQuestion_customerEmail_createdAt_idx" ON "ProductQuestion"("customerEmail", "createdAt");
