/*
  Warnings:

  - The primary key for the `Customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Customer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Purchase` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `product` on the `Purchase` table. All the data in the column will be lost.
  - The `id` column on the `Purchase` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `amount` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `customerId` on the `Purchase` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_customerId_fkey";

-- AlterTable
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Customer_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "price",
DROP COLUMN "product",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "customerId",
ADD COLUMN     "customerId" INTEGER NOT NULL,
ADD CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
