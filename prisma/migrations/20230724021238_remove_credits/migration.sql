/*
  Warnings:

  - You are about to drop the `Credit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Credit" DROP CONSTRAINT "Credit_userId_fkey";

-- DropTable
DROP TABLE "Credit";
