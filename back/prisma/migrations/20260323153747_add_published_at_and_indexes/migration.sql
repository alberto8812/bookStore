-- AlterTable: add published_at with default for existing rows, then drop the default
ALTER TABLE "book" ADD COLUMN "published_at" TIMESTAMP(3) NOT NULL DEFAULT now();
-- Backfill existing rows with their created_at value
UPDATE "book" SET "published_at" = "created_at" WHERE "published_at" = now();
-- Remove the default so future inserts must provide it explicitly
ALTER TABLE "book" ALTER COLUMN "published_at" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "book_title_idx" ON "book"("title");

-- CreateIndex
CREATE INDEX "book_published_at_idx" ON "book"("published_at");
