import { Module } from '@nestjs/common';
import { SatelliteService } from './satellite.service';
import { SatelliteController } from './satellite.controller';
import { OrbcommV2Service } from './api/orbcomm_v2/orbcomm_v2.service';
import { OrbcommV2Service } from './api/orbcomm-v2/orbcomm-v2.service';
import { OrbcommV2Controller } from './api/orbcomm-v2/orbcomm-v2.controller';
import { DownloadService } from './api/orbcomm-v2/download/download.service';
import { OrbcommV2Module } from './api/orbcomm-v2/orbcomm-v2.module';

@Module({
  providers: [SatelliteService, OrbcommV2Service, DownloadService],
  controllers: [SatelliteController, OrbcommV2Controller],
  imports: [OrbcommV2Module]
})
export class SatelliteModule {}
