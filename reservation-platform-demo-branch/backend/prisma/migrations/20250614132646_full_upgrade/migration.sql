/*
  Warnings:

  - You are about to alter the column `status` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - You are about to alter the column `status` on the `Reservation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to drop the column `image` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `VipRequest` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - A unique constraint covering the columns `[reservationId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reservationId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyName` to the `VipRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vipCardNumber` to the `VipRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Payment` ADD COLUMN `paymentMethod` VARCHAR(191) NULL,
    ADD COLUMN `reservationId` VARCHAR(191) NOT NULL,
    MODIFY `amount` INTEGER NOT NULL,
    MODIFY `status` ENUM('대기', '완료', '취소') NOT NULL DEFAULT '대기';

-- AlterTable
ALTER TABLE `Reservation` ADD COLUMN `name` VARCHAR(191) NULL,
    ADD COLUMN `specialRequest` VARCHAR(191) NULL,
    MODIFY `status` ENUM('대기', '확정', '취소') NOT NULL DEFAULT '대기';

-- AlterTable
ALTER TABLE `Restaurant` DROP COLUMN `image`,
    ADD COLUMN `commissionFee` INTEGER NULL,
    ADD COLUMN `corkage` BOOLEAN NULL,
    ADD COLUMN `menu` LONGTEXT NULL,
    ADD COLUMN `numberOfSeats` INTEGER NULL,
    ADD COLUMN `ownerId` VARCHAR(191) NULL,
    ADD COLUMN `parking` BOOLEAN NULL,
    ADD COLUMN `registrationDate` DATETIME(3) NULL,
    ADD COLUMN `stars` INTEGER NULL,
    MODIFY `nameKorean` VARCHAR(191) NULL,
    MODIFY `category` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `companyName` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `userType` ENUM('일반', 'VIP', '관리자') NOT NULL DEFAULT '일반',
    ADD COLUMN `vipCardNumber` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `VipRequest` ADD COLUMN `companyName` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `vipCardNumber` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('대기', '승인', '거절') NOT NULL DEFAULT '대기';

-- CreateIndex
CREATE UNIQUE INDEX `Payment_reservationId_key` ON `Payment`(`reservationId`);

-- CreateIndex
CREATE INDEX `Payment_reservationId_idx` ON `Payment`(`reservationId`);

-- CreateIndex
CREATE INDEX `Reservation_restaurantId_date_idx` ON `Reservation`(`restaurantId`, `date`);

-- CreateIndex
CREATE INDEX `Restaurant_category_idx` ON `Restaurant`(`category`);

-- CreateIndex
CREATE INDEX `Restaurant_ownerId_idx` ON `Restaurant`(`ownerId`);

-- CreateIndex
CREATE INDEX `User_userType_idx` ON `User`(`userType`);

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `Reservation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RedefineIndex
CREATE INDEX `Favorite_restaurantId_idx` ON `Favorite`(`restaurantId`);
DROP INDEX `Favorite_restaurantId_fkey` ON `Favorite`;

-- RedefineIndex
CREATE INDEX `Favorite_userId_idx` ON `Favorite`(`userId`);
DROP INDEX `Favorite_userId_fkey` ON `Favorite`;

-- RedefineIndex
CREATE INDEX `MenuItem_restaurantId_idx` ON `MenuItem`(`restaurantId`);
DROP INDEX `MenuItem_restaurantId_fkey` ON `MenuItem`;

-- RedefineIndex
CREATE INDEX `Payment_userId_idx` ON `Payment`(`userId`);
DROP INDEX `Payment_userId_fkey` ON `Payment`;

-- RedefineIndex
CREATE INDEX `Reservation_userId_idx` ON `Reservation`(`userId`);
DROP INDEX `Reservation_userId_fkey` ON `Reservation`;

-- RedefineIndex
CREATE INDEX `Review_restaurantId_idx` ON `Review`(`restaurantId`);
DROP INDEX `Review_restaurantId_fkey` ON `Review`;

-- RedefineIndex
CREATE INDEX `Review_userId_idx` ON `Review`(`userId`);
DROP INDEX `Review_userId_fkey` ON `Review`;

-- RedefineIndex
CREATE INDEX `VipRequest_userId_idx` ON `VipRequest`(`userId`);
DROP INDEX `VipRequest_userId_fkey` ON `VipRequest`;
