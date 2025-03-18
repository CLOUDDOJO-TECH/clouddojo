/*
  Warnings:

  - You are about to drop the column `price` on the `Quiz` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('BEGINER', 'INTERMEDIATE', 'ADVANCED');

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "price",
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "free" BOOLEAN,
ADD COLUMN     "level" "DifficultyLevel" DEFAULT 'BEGINER';
