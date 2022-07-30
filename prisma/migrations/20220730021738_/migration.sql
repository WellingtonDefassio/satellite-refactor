/*
  Warnings:

  - You are about to drop the `orbcommdownloadparamcontroll` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `orbcommdownloadparamcontroll`;

-- CreateTable
CREATE TABLE `OrbcommDownloadParamControl` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `previousMessage` VARCHAR(191) NOT NULL,
    `nextMessage` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
