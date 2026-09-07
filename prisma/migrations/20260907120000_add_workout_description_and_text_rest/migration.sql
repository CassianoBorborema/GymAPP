ALTER TABLE "Workout" ADD COLUMN "description" TEXT;

ALTER TABLE "WorkoutItem"
ALTER COLUMN "restTime" TYPE TEXT
USING "restTime"::TEXT;