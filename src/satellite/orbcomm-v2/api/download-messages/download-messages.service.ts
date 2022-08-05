import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  DownloadMessage,
  ResponseDownloadMessage,
} from '../../interfaces/orbcomm-interfaces';

@Injectable()
export class DownloadMessagesService {
  constructor(private prisma: PrismaService, private http: HttpService) {}

  // @Cron(CronExpression.EVERY_5_MINUTES)
  async downloadMessages() {
    console.log('DOWNLOAD MESSAGES START...');

    const link = process.env.ORBCOMM_DOWNLOAD_LINK;

    try {
      const nextMessageParam = await this.findNextMessage();

      const httpResponse = await this.http.axiosRef
        .get(link, {
          params: { start_utc: nextMessageParam },
        })
        .then((res) => res.data)
        .catch((e) => {
          throw new Error(e.message);
        });

      this.validateResponse(httpResponse);

      await this.createManyMessages(httpResponse);
      await this.upsertMobileVersion(httpResponse);
      await this.createNextUtcParam(
        nextMessageParam,
        httpResponse.NextStartUTC,
      );
    } catch (error) {
      console.log(error.message);
      await this.prisma.orbcommLogError.create({
        data: { service: 'DOWNLOAD_MESSAGE', description: error.message },
      });
    }
  }

  validateResponse(data: ResponseDownloadMessage): void {
    if (data.ErrorID === undefined || data.ErrorID === null) {
      throw new Error('VERIFY THE DOWNLOAD MESSAGES CALL');
    }
    if (data.ErrorID !== 0) {
      throw new Error(
        `ERROR IN REQUEST API ORBCOMM VERIFY THE ERROR ID: ${data.ErrorID}`,
      );
    }
    if (data.ErrorID === 0 && data.Messages === null) {
      throw new Error('THIS REQUEST NOT RETURN ANY MESSAGES');
    }
  }

  async createNextUtcParam(
    previousMessage: string,
    nextMessage: string,
  ): Promise<void> {
    await this.prisma.orbcommDownloadParamControl.create({
      data: {
        previousMessage,
        nextMessage,
      },
    });
  }

  async createManyMessages(data: ResponseDownloadMessage): Promise<void> {
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
    await this.prisma.orbcommDownloadMessages.createMany({
      data: mappedMessages,
      skipDuplicates: true,
    });
  }

  async upsertMobileVersion(data: ResponseDownloadMessage): Promise<void> {
    const messagesWithPayload = this.formatPayload(data);

    messagesWithPayload.map(async (message) => {
      await this.prisma.orbcommMobileVersion.upsert({
        create: {
          deviceId: message.MobileID,
          SIN: message.Payload.SIN,
          MIN: message.Payload.MIN,
          name: message.Payload.Name,
          fields: message.Payload.Fields,
        },
        where: { deviceId: message.MobileID },
        update: {
          SIN: message.Payload.SIN,
          MIN: message.Payload.MIN,
          name: message.Payload.Name,
          fields: message.Payload.Fields,
        },
      });
    });
  }

  formatPayload(data: ResponseDownloadMessage): DownloadMessage[] {
    const messagesWithPayload = data.Messages.filter(
      (message) => message.Payload,
    );

    const uniqueIdList = [];

    const uniqueList = messagesWithPayload.filter((element) => {
      const isDuplicate = uniqueIdList.includes(element.MobileID);
      if (!isDuplicate) {
        uniqueIdList.push(element.MobileID);
        return true;
      }
      return false;
    });

    return uniqueList;
  }

  async findNextMessage(): Promise<string> {
    const lastMessage = await this.prisma.orbcommDownloadParamControl.findFirst(
      {
        select: { nextMessage: true },
        orderBy: [{ id: 'desc' }],
        take: 1,
      },
    );
    if (!lastMessage) {
      throw new Error(
        'NO PARAM FOUND IN "orbcommDownloadParamControl" TABLE, PLS VERIFY',
      );
    } else {
      return lastMessage.nextMessage;
    }
  }
}
