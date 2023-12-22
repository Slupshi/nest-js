/*
  Warnings:

  - You are about to drop the `CategoriesOnPosts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `price` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CategoriesOnPosts" DROP CONSTRAINT "CategoriesOnPosts_orderId_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesOnPosts" DROP CONSTRAINT "CategoriesOnPosts_productId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "total" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'CLIENT';

-- DropTable
DROP TABLE "CategoriesOnPosts";

-- CreateTable
CREATE TABLE "OrderOnProducts" (
    "quantity" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    "orderAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderOnProducts_pkey" PRIMARY KEY ("productId","orderId")
);

-- AddForeignKey
ALTER TABLE "OrderOnProducts" ADD CONSTRAINT "OrderOnProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderOnProducts" ADD CONSTRAINT "OrderOnProducts_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
