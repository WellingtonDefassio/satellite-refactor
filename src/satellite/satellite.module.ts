import { Module } from '@nestjs/common';
import { SatelliteService } from './satellite.service';
import { SatelliteController } from './satellite.controller';

@Module({
  providers: [SatelliteService],
  controllers: [SatelliteController]
})
export class SatelliteModule {}
