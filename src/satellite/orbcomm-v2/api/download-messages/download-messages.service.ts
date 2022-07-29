import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ResponseDownloadMessage } from '../../interfaces/orbcomm-interfaces';

@Injectable()
export class DownloadMessagesService {
  constructor(private prisma: PrismaService, private http: HttpService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async downloadMessages() {
    console.log('DOWNLOAD MESSAGES START...');

    const params = { id: 0 };
    const link =
      'https://isatdatapro.orbcomm.com/GLGW/2/RestMessages.svc/JSON/get_return_messages/?access_id=70002657&password=ZFLLYNJL&include_raw_payload=true&start_utc=2022-06-07 22:13:23';

    const apiResponse$ = this.http.get(link);

    apiResponse$.subscribe({
      next: (value) => {
        this.createManyMessages(value.data);
      },
    });
  }

  async createManyMessages(data: ResponseDownloadMessage) {
    const mappedMessages = data.Messages.map((message) => {
      return {
        messageId: message.ID.toString(),
        messageUTC: new Date(message.MessageUTC),
        receiveUTC: new Date(message.ReceiveUTC),
        deviceId: message.MobileID,
        SIN: message.SIN,
        MIN: message.RawPayload[1],
        payload: Buffer.of(...message.RawPayload).toString('hex'),
        regionName: message.RegionName,
        otaMessageSize: message.OTAMessageSize,
        costumerID: message.CustomerID,
        transport: message.Transport,
        mobileOwnerID: message.MobileOwnerID.toString(),
      };
    });
    return await this.prisma.orbcommDownloadMessages.createMany({
      data: mappedMessages,
      skipDuplicates: true,
    });
  }
}
