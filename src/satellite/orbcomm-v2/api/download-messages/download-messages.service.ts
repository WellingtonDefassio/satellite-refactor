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

  // @Cron(CronExpression.EVERY_10_SECONDS)
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

      const httpResponseValidated = this.validateResponse(httpResponse);

      await this.createManyMessages(httpResponseValidated);
      await this.upsertMobileVersion(httpResponseValidated);
      await this.createNextUtcParam(
        nextMessageParam,
        httpResponseValidated.NextStartUTC,
      );
    } catch (error) {
      console.log(error.message);
      await this.prisma.orbcommLogError.create({
        data: { description: error.message },
      });
    }
  }

  validateResponse(data: ResponseDownloadMessage) {
    if (data.ErrorID === undefined) {
      throw new Error(`VERIFY THE DOWNLOAD MESSAGES CALL`);
    }
    if (data.ErrorID !== 0) {
      throw new Error(
        `ERROR IN REQUEST API ORBCOMM VERIFY THE ERROR ID: ${data.ErrorID}`,
      );
    }
    if (data.ErrorID === 0 && !data.Messages.length) {
      throw new Error(`THIS REQUEST NOT RETURN ANY MESSAGES`);
    } else {
      return data;
    }
  }

  async createNextUtcParam(previousMessage: string, nextMessage: string) {
    await this.prisma.orbcommDownloadParamControl.create({
      data: {
        previousMessage,
        nextMessage,
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

  async upsertMobileVersion(data: ResponseDownloadMessage) {
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
        'no param found in "orbcommDownloadParamControl" table pls verify',
      );
    } else {
      return lastMessage.nextMessage;
    }
  }
}
