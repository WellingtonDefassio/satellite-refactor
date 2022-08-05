/*
  Warnings:

  - You are about to drop the column `gatewayId` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `satellitesendedmessages` table. All the data in the column will be lost.
  - You are about to drop the `orbcommdownloadmessages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `satelliteattribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `satellitegateway` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `satellitevalue` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `satelliteServiceName` to the `Devices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `devices` DROP FOREIGN KEY `Devices_gatewayId_fkey`;

-- DropForeignKey
ALTER TABLE `satelliteattribute` DROP FOREIGN KEY `SatelliteAttribute_gatewayId_fkey`;

-- DropForeignKey
ALTER TABLE `satellitevalue` DROP FOREIGN KEY `SatelliteValue_satelliteItemName_fkey`;

-- DropForeignKey
ALTER TABLE `satellitevalue` DROP FOREIGN KEY `SatelliteValue_satelliteMessageId_fkey`;

-- AlterTable
ALTER TABLE `devices` DROP COLUMN `gatewayId`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `satelliteServiceName` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('ACTIVE', 'DISABLED') NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE `satellitesendedmessages` DROP COLUMN `updatedAt`;

-- DropTable
DROP TABLE `orbcommdownloadmessages`;

-- DropTable
DROP TABLE `satelliteattribute`;

-- DropTable
DROP TABLE `satellitegateway`;

-- DropTable
DROP TABLE `satellitevalue`;

-- CreateTable
CREATE TABLE `SatelliteServices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SatelliteServices_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SatelliteSendedSpecificAttributes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `attribute` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `satelliteServiceName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SatelliteSendedSpecificAttributes_attribute_satelliteService_key`(`attribute`, `satelliteServiceName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SatelliteSendedSpecificValues` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sendedMessageId` INTEGER NOT NULL,
    `sendedMessageAttributeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SatelliteEmittedMessages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `payload` VARCHAR(191) NOT NULL,
    `device` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SatelliteEmittedSpecificAttributes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `attribute` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `satelliteServiceName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SatelliteEmittedSpecificAttributes_attribute_satelliteServic_key`(`attribute`, `satelliteServiceName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SatelliteEmittedSpecificValues` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `emittedMessageId` INTEGER NOT NULL,
    `emittedMessageAttributeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Devices` ADD CONSTRAINT `Devices_satelliteServiceName_fkey` FOREIGN KEY (`satelliteServiceName`) REFERENCES `SatelliteServices`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SatelliteSendedSpecificAttributes` ADD CONSTRAINT `SatelliteSendedSpecificAttributes_satelliteServiceName_fkey` FOREIGN KEY (`satelliteServiceName`) REFERENCES `SatelliteServices`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SatelliteSendedSpecificValues` ADD CONSTRAINT `SatelliteSendedSpecificValues_sendedMessageId_fkey` FOREIGN KEY (`sendedMessageId`) REFERENCES `SatelliteSendedMessages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SatelliteSendedSpecificValues` ADD CONSTRAINT `SatelliteSendedSpecificValues_sendedMessageAttributeId_fkey` FOREIGN KEY (`sendedMessageAttributeId`) REFERENCES `SatelliteSendedSpecificAttributes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SatelliteEmittedSpecificAttributes` ADD CONSTRAINT `SatelliteEmittedSpecificAttributes_satelliteServiceName_fkey` FOREIGN KEY (`satelliteServiceName`) REFERENCES `SatelliteServices`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SatelliteEmittedSpecificValues` ADD CONSTRAINT `SatelliteEmittedSpecificValues_emittedMessageId_fkey` FOREIGN KEY (`emittedMessageId`) REFERENCES `SatelliteEmittedMessages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SatelliteEmittedSpecificValues` ADD CONSTRAINT `SatelliteEmittedSpecificValues_emittedMessageAttributeId_fkey` FOREIGN KEY (`emittedMessageAttributeId`) REFERENCES `SatelliteEmittedSpecificAttributes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
