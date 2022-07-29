-- CreateTable
CREATE TABLE `OrbcommDownloadParamControll` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `previousMessage` VARCHAR(191) NOT NULL,
    `nextMessage` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrbcomMobileVersion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deviceId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `SIN` INTEGER NOT NULL,
    `MIN` INTEGER NOT NULL,
    `fields` JSON NOT NULL,

    UNIQUE INDEX `OrbcomMobileVersion_deviceId_key`(`deviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrbcommLogError` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` MEDIUMTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
