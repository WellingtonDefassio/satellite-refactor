-- CreateTable
CREATE TABLE `SatelliteServices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SatelliteServices_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Devices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deviceId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('ACTIVE', 'DISABLED') NOT NULL DEFAULT 'ACTIVE',
    `satelliteServiceName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Devices_deviceId_key`(`deviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SatelliteSendedMessages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `payload` MEDIUMTEXT NOT NULL,
    `status` ENUM('CREATED', 'SUBMITTED', 'SENDED', 'TIMEOUT', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'CREATED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deviceId` VARCHAR(191) NOT NULL,

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
    `attributeName` VARCHAR(191) NOT NULL,
    `satelliteServiceName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SatelliteSendedSpecificValues_sendedMessageId_attributeName__key`(`sendedMessageId`, `attributeName`, `satelliteServiceName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SatelliteEmittedMessages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `payload` MEDIUMTEXT NOT NULL,
    `device` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `dateUtc` DATETIME(3) NOT NULL,

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

-- AddForeignKey
ALTER TABLE `Devices` ADD CONSTRAINT `Devices_satelliteServiceName_fkey` FOREIGN KEY (`satelliteServiceName`) REFERENCES `SatelliteServices`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SatelliteSendedMessages` ADD CONSTRAINT `SatelliteSendedMessages_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Devices`(`deviceId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SatelliteSendedSpecificAttributes` ADD CONSTRAINT `SatelliteSendedSpecificAttributes_satelliteServiceName_fkey` FOREIGN KEY (`satelliteServiceName`) REFERENCES `SatelliteServices`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SatelliteSendedSpecificValues` ADD CONSTRAINT `SatelliteSendedSpecificValues_sendedMessageId_fkey` FOREIGN KEY (`sendedMessageId`) REFERENCES `SatelliteSendedMessages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SatelliteSendedSpecificValues` ADD CONSTRAINT `SatelliteSendedSpecificValues_attributeName_satelliteServic_fkey` FOREIGN KEY (`attributeName`, `satelliteServiceName`) REFERENCES `SatelliteSendedSpecificAttributes`(`attribute`, `satelliteServiceName`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SatelliteEmittedSpecificAttributes` ADD CONSTRAINT `SatelliteEmittedSpecificAttributes_satelliteServiceName_fkey` FOREIGN KEY (`satelliteServiceName`) REFERENCES `SatelliteServices`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SatelliteEmittedSpecificValues` ADD CONSTRAINT `SatelliteEmittedSpecificValues_emittedMessageId_fkey` FOREIGN KEY (`emittedMessageId`) REFERENCES `SatelliteEmittedMessages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SatelliteEmittedSpecificValues` ADD CONSTRAINT `SatelliteEmittedSpecificValues_emittedMessageAttributeId_fkey` FOREIGN KEY (`emittedMessageAttributeId`) REFERENCES `SatelliteEmittedSpecificAttributes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
