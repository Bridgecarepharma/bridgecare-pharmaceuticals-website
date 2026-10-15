CREATE TABLE "VerificationBatch" (
 "id" TEXT NOT NULL PRIMARY KEY, "productSlug" TEXT NOT NULL, "productName" TEXT NOT NULL,
 "batchNumber" TEXT NOT NULL, "manufacturedAt" TIMESTAMP(3) NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL,
 "active" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "VerificationBatch_productSlug_batchNumber_key" ON "VerificationBatch"("productSlug", "batchNumber");
CREATE TABLE "VerificationCode" (
 "id" TEXT NOT NULL PRIMARY KEY, "codeHash" TEXT NOT NULL, "batchId" TEXT NOT NULL,
 "disabled" BOOLEAN NOT NULL DEFAULT false, "checks" INTEGER NOT NULL DEFAULT 0,
 "firstCheckedAt" TIMESTAMP(3), "lastCheckedAt" TIMESTAMP(3),
 CONSTRAINT "VerificationCode_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "VerificationBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "VerificationCode_codeHash_key" ON "VerificationCode"("codeHash");
CREATE INDEX "VerificationCode_batchId_idx" ON "VerificationCode"("batchId");
CREATE TABLE "VerificationEvent" (
 "id" TEXT NOT NULL PRIMARY KEY, "codeId" TEXT, "outcome" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "VerificationEvent_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "VerificationCode"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "VerificationEvent_createdAt_idx" ON "VerificationEvent"("createdAt");
CREATE INDEX "VerificationEvent_codeId_createdAt_idx" ON "VerificationEvent"("codeId", "createdAt");
CREATE TABLE "VerificationLimit" ("key" TEXT NOT NULL PRIMARY KEY, "count" INTEGER NOT NULL DEFAULT 1, "expiresAt" TIMESTAMP(3) NOT NULL);
CREATE INDEX "VerificationLimit_expiresAt_idx" ON "VerificationLimit"("expiresAt");
