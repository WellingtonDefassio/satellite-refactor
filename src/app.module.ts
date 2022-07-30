import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SatelliteModule } from './satellite/satellite.module';

@Module({
  imports: [SatelliteModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
