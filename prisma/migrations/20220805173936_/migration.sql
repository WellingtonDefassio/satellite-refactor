/*
  Warnings:

  - Added the required column `dateUtc` to the `SatelliteEmittedMessages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `satelliteemittedmessages` ADD COLUMN `dateUtc` DATETIME(3) NOT NULL;
