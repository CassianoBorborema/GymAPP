-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN IF NOT EXISTS "videoUrl" TEXT;

-- AlterTable
ALTER TABLE "Instructor" ADD COLUMN IF NOT EXISTS "password" TEXT NOT NULL DEFAULT 'temp';
ALTER TABLE "Instructor" ALTER COLUMN "password" DROP DEFAULT;
