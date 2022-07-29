import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { OrbcommV2Module } from './satellite/orbcomm-v2/orbcomm-v2.module';
import { SatelliteModule } from './satellite/satellite.module';

@Module({
  imports: [SatelliteModule, ScheduleModule.forRoot(), OrbcommV2Module],
  controllers: [],
  providers: [],
})
export class AppModule {}
