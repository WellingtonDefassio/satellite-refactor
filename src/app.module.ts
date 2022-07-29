import { Module } from '@nestjs/common';
import { MoService } from './mo/mo.service';
import { SatelliteModule } from './satellite/satellite.module';

@Module({
  imports: [SatelliteModule],
  controllers: [],
  providers: [MoService],
})
export class AppModule {}
