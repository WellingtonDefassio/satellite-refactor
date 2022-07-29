import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ResponseDownloadMessage } from '../../interfaces/orbcomm-interfaces';

@Injectable()
export class DownloadMessagesService {
  constructor(private prisma: PrismaService, private http: HttpService) {}

  async downloadMessages() {
    const params = { id: 0 };
    const link = 'any';

    const apiResponse$ = this.http.get(link, {
      params,
    });

    apiResponse$.subscribe({
      next(value) {
        console.log(value);
        // this.createManyMessages(value);
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
        payload: message.RawPayload.toString(),
        regionName: message.RegionName,
        otaMessageSize: message.OTAMessageSize,
        costumerID: message.CustomerID,
        transport: message.Transport,
        mobileOwnerID: message.MobileOwnerID.toString(),
      };
    });
    return await this.prisma.orbcommDownloadMessages.createMany({
      data: mappedMessages,
    });
  }
}
