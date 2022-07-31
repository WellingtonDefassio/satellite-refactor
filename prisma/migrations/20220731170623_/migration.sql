-- CreateTable
CREATE TABLE `SatelliteSendedMessages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `payload` MEDIUMTEXT NOT NULL,
    `deviceId` VARCHAR(191) NOT NULL,
    `status` ENUM('CREATED', 'SUBMITTED', 'SENDED', 'TIMEOUT', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'CREATED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrcommSendedMessages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `satelliteMessageId` INTEGER NOT NULL,
    `fwrdMessageId` VARCHAR(191) NOT NULL,
    `status` ENUM('SUBMITTED', 'RECEIVED', 'ERROR', 'DELIVERY_FAILED', 'TIMEOUT', 'CANCELLED', 'WAITING', 'INVALID', 'TRANSMITTED') NOT NULL,

    UNIQUE INDEX `OrcommSendedMessages_satelliteMessageId_key`(`satelliteMessageId`),
    UNIQUE INDEX `OrcommSendedMessages_id_satelliteMessageId_key`(`id`, `satelliteMessageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Devices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deviceId` VARCHAR(191) NOT NULL,
    `gatewayId` INTEGER NOT NULL,
    `status` ENUM('ACTIVE', 'DISABLED') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Devices_deviceId_key`(`deviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SatelliteGateway` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SatelliteGateway_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SatelliteSendedMessages` ADD CONSTRAINT `SatelliteSendedMessages_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Devices`(`deviceId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrcommSendedMessages` ADD CONSTRAINT `OrcommSendedMessages_satelliteMessageId_fkey` FOREIGN KEY (`satelliteMessageId`) REFERENCES `SatelliteSendedMessages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Devices` ADD CONSTRAINT `Devices_gatewayId_fkey` FOREIGN KEY (`gatewayId`) REFERENCES `SatelliteGateway`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
