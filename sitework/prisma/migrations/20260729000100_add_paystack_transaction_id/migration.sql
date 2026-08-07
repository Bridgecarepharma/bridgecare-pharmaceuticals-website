ALTER TABLE "Order" ADD COLUMN "paystackTransactionId" TEXT;
CREATE UNIQUE INDEX "Order_paystackTransactionId_key" ON "Order"("paystackTransactionId");
