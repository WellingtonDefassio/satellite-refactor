import { Module } from '@nestjs/common';
import { SatelliteModule } from './satellite/satellite.module';

@Module({
  imports: [SatelliteModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
