/*
  Warnings:

  - Added the required column `muscleGroup` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "muscleGroup" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WorkoutItem" ADD COLUMN     "observations" TEXT,
ADD COLUMN     "restTime" INTEGER;
