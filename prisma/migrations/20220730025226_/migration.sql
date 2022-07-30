/*
  Warnings:

  - You are about to drop the `orbcommobileversion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `orbcommobileversion`;

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
