-- CreateEnum
CREATE TYPE "GuideLevel" AS ENUM ('beginner', 'intermediate', 'advanced');

-- AlterTable
ALTER TABLE "Guide" ADD COLUMN     "level" "GuideLevel" NOT NULL DEFAULT 'beginner',
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Guide_level_sortOrder_idx" ON "Guide"("level", "sortOrder");
