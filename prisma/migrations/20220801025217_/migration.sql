/*
  Warnings:

  - A unique constraint covering the columns `[satelliteItemId,satelliteMessageId,value]` on the table `SatelliteItensRegister` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `SatelliteItensRegister_satelliteItemId_satelliteMessageId_va_key` ON `SatelliteItensRegister`(`satelliteItemId`, `satelliteMessageId`, `value`);
