import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  DownloadMessage,
  ResponseDownloadMessage,
} from '../../interfaces/orbcomm-interfaces';

@Injectable()
export class EmittedMessagesServices {
  constructor(private prisma: PrismaService, private http: HttpService) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
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
        data: { service: 'EMITTED_MESSAGES', description: error.message },
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
    data.Messages.map(async (message) => {
      return await this.prisma.satelliteEmittedMessages.create({
        data: {
          payload: Buffer.of(...message.RawPayload).toString('hex'),
          device: message.MobileID,
          messageSize: message.OTAMessageSize,
          dateUtc: new Date(message.MessageUTC + 'Z'),
          satelliteSpecificValues: {
            create: [
              {
                value: message.ID.toString(),
                emittedAttribute: {
                  connect: {
                    attribute_satelliteServiceName: {
                      attribute: 'messageId',
                      satelliteServiceName: 'ORBCOMM_V2',
                    },
                  },
                },
              },
              {
                value: new Date(message.ReceiveUTC + 'Z').toISOString(),
                emittedAttribute: {
                  connect: {
                    attribute_satelliteServiceName: {
                      attribute: 'receiveUTC',
                      satelliteServiceName: 'ORBCOMM_V2',
                    },
                  },
                },
              },
              {
                value: message.SIN.toString(),
                emittedAttribute: {
                  connect: {
                    attribute_satelliteServiceName: {
                      attribute: 'SIN',
                      satelliteServiceName: 'ORBCOMM_V2',
                    },
                  },
                },
              },
              {
                value: message.RawPayload[1].toString(),
                emittedAttribute: {
                  connect: {
                    attribute_satelliteServiceName: {
                      attribute: 'MIN',
                      satelliteServiceName: 'ORBCOMM_V2',
                    },
                  },
                },
              },
              {
                value: message.RegionName,
                emittedAttribute: {
                  connect: {
                    attribute_satelliteServiceName: {
                      attribute: 'regionName',
                      satelliteServiceName: 'ORBCOMM_V2',
                    },
                  },
                },
              },
              {
                value: message.CustomerID.toString(),
                emittedAttribute: {
                  connect: {
                    attribute_satelliteServiceName: {
                      attribute: 'costumerId',
                      satelliteServiceName: 'ORBCOMM_V2',
                    },
                  },
                },
              },
              {
                value: message.Transport.toString(),
                emittedAttribute: {
                  connect: {
                    attribute_satelliteServiceName: {
                      attribute: 'transport',
                      satelliteServiceName: 'ORBCOMM_V2',
                    },
                  },
                },
              },
              {
                value: message.MobileOwnerID.toString(),
                emittedAttribute: {
                  connect: {
                    attribute_satelliteServiceName: {
                      attribute: 'mobileOwnerId',
                      satelliteServiceName: 'ORBCOMM_V2',
                    },
                  },
                },
              },
            ],
          },
        },
      });
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
    const { nextMessage } =
      await this.prisma.orbcommDownloadParamControl.findFirst({
        select: { nextMessage: true },
        orderBy: [{ id: 'desc' }],
        take: 1,
      });

    if (!nextMessage) {
      throw new Error('orbcommDownloadParamControl not provide a return value');
    } else {
      return nextMessage;
    }
  }
}
