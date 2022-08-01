-- CreateTable
CREATE TABLE `OrbcommDownloadMessages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `messageId` VARCHAR(191) NOT NULL,
    `messageUTC` DATETIME(3) NOT NULL,
    `receiveUTC` DATETIME(3) NOT NULL,
    `deviceId` VARCHAR(191) NOT NULL,
    `SIN` INTEGER NOT NULL,
    `MIN` INTEGER NOT NULL,
    `payload` MEDIUMTEXT NOT NULL,
    `regionName` VARCHAR(191) NOT NULL,
    `otaMessageSize` INTEGER NOT NULL,
    `costumerID` INTEGER NOT NULL,
    `transport` INTEGER NOT NULL,
    `mobileOwnerID` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `OrbcommDownloadMessages_messageId_key`(`messageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrbcommDownloadParamControl` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `previousMessage` VARCHAR(191) NOT NULL,
    `nextMessage` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrbcommMobileVersion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deviceId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `SIN` INTEGER NOT NULL,
    `MIN` INTEGER NOT NULL,
    `fields` JSON NOT NULL,

    UNIQUE INDEX `OrbcommMobileVersion_deviceId_key`(`deviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrbcommLogError` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `service` VARCHAR(191) NOT NULL,
    `description` MEDIUMTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
CREATE TABLE `SatelliteAttribute` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `gatewayId` INTEGER NOT NULL,
    `item` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SatelliteAttribute_item_key`(`item`),
    UNIQUE INDEX `SatelliteAttribute_gatewayId_item_key`(`gatewayId`, `item`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SatelliteValue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `satelliteMessageId` INTEGER NOT NULL,
    `satelliteItemName` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SatelliteValue_satelliteMessageId_satelliteItemName_key`(`satelliteMessageId`, `satelliteItemName`),
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
ALTER TABLE `SatelliteAttribute` ADD CONSTRAINT `SatelliteAttribute_gatewayId_fkey` FOREIGN KEY (`gatewayId`) REFERENCES `SatelliteGateway`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SatelliteValue` ADD CONSTRAINT `SatelliteValue_satelliteMessageId_fkey` FOREIGN KEY (`satelliteMessageId`) REFERENCES `SatelliteSendedMessages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SatelliteValue` ADD CONSTRAINT `SatelliteValue_satelliteItemName_fkey` FOREIGN KEY (`satelliteItemName`) REFERENCES `SatelliteAttribute`(`item`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Devices` ADD CONSTRAINT `Devices_gatewayId_fkey` FOREIGN KEY (`gatewayId`) REFERENCES `SatelliteGateway`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
