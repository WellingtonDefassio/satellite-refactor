import { Module } from '@nestjs/common';
import { SatelliteService } from './satellite.service';
import { SatelliteController } from './satellite.controller';
import { DownloadMessagesService } from './orbcomm-v2/api/download-messages/download-messages.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SendMessagesService } from './orbcomm-v2/api/send-messages/send-messages.service';
import { CheckMessagesStatusService } from './orbcomm-v2/api/check-messages-status/check-messages-status.service';

@Module({
  providers: [
    SatelliteService,
    DownloadMessagesService,
    SendMessagesService,
    CheckMessagesStatusService,
  ],
  controllers: [SatelliteController],
  imports: [HttpModule, PrismaModule],
})
export class SatelliteModule {}
