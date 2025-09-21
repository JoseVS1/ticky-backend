-- CreateEnum
CREATE TYPE "public"."TodoPriority" AS ENUM ('none', 'low', 'medium', 'high');

-- AlterTable
ALTER TABLE "public"."Todo" ADD COLUMN     "priority" "public"."TodoPriority" NOT NULL DEFAULT 'none';
