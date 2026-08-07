-- v6.4.2: add Product Questions only. Existing Verified Reviews schema is preserved.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'QuestionStatus') THEN
    CREATE TYPE "QuestionStatus" AS ENUM ('PENDING', 'ANSWERED', 'ARCHIVED');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "ProductQuestion" (
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

CREATE INDEX IF NOT EXISTS "ProductQuestion_productSlug_status_createdAt_idx"
  ON "ProductQuestion"("productSlug", "status", "createdAt");
CREATE INDEX IF NOT EXISTS "ProductQuestion_status_createdAt_idx"
  ON "ProductQuestion"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "ProductQuestion_customerEmail_createdAt_idx"
  ON "ProductQuestion"("customerEmail", "createdAt");
