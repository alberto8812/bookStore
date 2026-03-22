-- DropForeignKey
ALTER TABLE "book" DROP CONSTRAINT "book_created_by_id_fkey";

-- AlterTable: user - change id from SERIAL to UUID
ALTER TABLE "user" DROP CONSTRAINT "user_pkey";
ALTER TABLE "user" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "id" SET DATA TYPE TEXT USING gen_random_uuid()::TEXT;
ALTER TABLE "user" ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");

-- AlterTable: book - change id from SERIAL to UUID, and created_by_id to TEXT
ALTER TABLE "book" DROP CONSTRAINT "book_pkey";
ALTER TABLE "book" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "book" ALTER COLUMN "id" SET DATA TYPE TEXT USING gen_random_uuid()::TEXT;
ALTER TABLE "book" ALTER COLUMN "created_by_id" SET DATA TYPE TEXT;
ALTER TABLE "book" ADD CONSTRAINT "book_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "book" ADD CONSTRAINT "book_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
