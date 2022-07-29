import { Module } from '@nestjs/common';
import { DownloadMessagesService } from './api/download-messages/download-messages.service';
import { CheckMessagesStatusService } from './api/check-messages-status/check-messages-status.service';
import { SendMessagesService } from './api/send-messages/send-messages.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [
    DownloadMessagesService,
    CheckMessagesStatusService,
    SendMessagesService,
  ],
  imports: [HttpModule, PrismaModule],
})
export class OrbcommV2Module {}
