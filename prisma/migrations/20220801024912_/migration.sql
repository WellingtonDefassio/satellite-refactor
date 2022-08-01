/*
  Warnings:

  - You are about to drop the `orcommsendedmessages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `orcommsendedmessages` DROP FOREIGN KEY `OrcommSendedMessages_satelliteMessageId_fkey`;

-- DropTable
DROP TABLE `orcommsendedmessages`;

-- CreateTable
CREATE TABLE `SatelliteItens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `gatewayId` INTEGER NOT NULL,
    `item` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SatelliteItens_item_key`(`item`),
    UNIQUE INDEX `SatelliteItens_gatewayId_item_key`(`gatewayId`, `item`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SatelliteItensRegister` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `satelliteMessageId` INTEGER NOT NULL,
    `satelliteItemId` INTEGER NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SatelliteItens` ADD CONSTRAINT `SatelliteItens_gatewayId_fkey` FOREIGN KEY (`gatewayId`) REFERENCES `SatelliteGateway`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SatelliteItensRegister` ADD CONSTRAINT `SatelliteItensRegister_satelliteMessageId_fkey` FOREIGN KEY (`satelliteMessageId`) REFERENCES `SatelliteSendedMessages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SatelliteItensRegister` ADD CONSTRAINT `SatelliteItensRegister_satelliteItemId_fkey` FOREIGN KEY (`satelliteItemId`) REFERENCES `SatelliteItens`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
