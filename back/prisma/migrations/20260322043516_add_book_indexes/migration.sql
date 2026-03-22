-- CreateIndex
CREATE INDEX "book_created_at_id_desc_idx" ON "book"("created_at" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "book_created_at_id_asc_idx" ON "book"("created_at" ASC, "id" ASC);
