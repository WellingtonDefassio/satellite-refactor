import { Module } from '@nestjs/common';
import { SatelliteService } from './satellite.service';
import { SatelliteController } from './satellite.controller';
import { DownloadMessagesService } from './orbcomm-v2/api/download-messages/download-messages.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [SatelliteService, DownloadMessagesService],
  controllers: [SatelliteController],
  imports: [HttpModule, PrismaModule],
})
export class SatelliteModule {}
