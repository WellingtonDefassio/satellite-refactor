import { Module } from '@nestjs/common';
import { DownloadMessagesService } from './api/download-messages/download-messages.service';
import { CheckMessagesStatusService } from './api/check-messages-status/check-messages-status.service';
import { SendMessagesService } from './api/send-messages/send-messages.service';

@Module({
  providers: [DownloadMessagesService, CheckMessagesStatusService, SendMessagesService]
})
export class OrbcommV2Module {}
