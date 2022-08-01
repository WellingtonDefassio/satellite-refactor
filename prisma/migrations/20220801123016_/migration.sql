/*
  Warnings:

  - You are about to drop the column `satelliteItemId` on the `satelliteitensregister` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[satelliteItemName,value]` on the table `SatelliteItensRegister` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `satelliteItemName` to the `SatelliteItensRegister` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `satelliteitensregister` DROP FOREIGN KEY `SatelliteItensRegister_satelliteItemId_fkey`;

-- DropIndex
DROP INDEX `SatelliteItensRegister_satelliteItemId_satelliteMessageId_va_key` ON `satelliteitensregister`;

-- AlterTable
ALTER TABLE `satelliteitensregister` DROP COLUMN `satelliteItemId`,
    ADD COLUMN `satelliteItemName` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `SatelliteItensRegister_satelliteItemName_value_key` ON `SatelliteItensRegister`(`satelliteItemName`, `value`);

-- AddForeignKey
ALTER TABLE `SatelliteItensRegister` ADD CONSTRAINT `SatelliteItensRegister_satelliteItemName_fkey` FOREIGN KEY (`satelliteItemName`) REFERENCES `SatelliteItens`(`item`) ON DELETE RESTRICT ON UPDATE CASCADE;
