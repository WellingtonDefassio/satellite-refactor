/*
  Warnings:

  - You are about to drop the column `size` on the `satelliteemittedmessages` table. All the data in the column will be lost.
  - Added the required column `messageSize` to the `SatelliteEmittedMessages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `satelliteemittedmessages` DROP COLUMN `size`,
    ADD COLUMN `messageSize` INTEGER NOT NULL;
