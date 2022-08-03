import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MessageStatus, SatelliteValue } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  BodyCheckApi,
  ForwardStatuses,
  FwrdIdInterface,
  MessageBodyCheck,
  OrbcommMessageStatus,
  OrbcommStatusMap,
  StatusesTypeWithId,
  SubmittedMessages,
} from '../../interfaces/orbcomm-interfaces';

@Injectable()
export class CheckMessagesStatusService {
  constructor(private prisma: PrismaService, private http: HttpService) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async checkMessagesStatus() {
    try {
      console.log('START CHECK SERVICE');

      const link = process.env.ORBCOMM_FORWARD_STATUSES;

      const messagesToCheck = await this.messagesToUpdateStatus();
      const formattedData = this.formatData(messagesToCheck);
      const messagesToSend = this.formatDataToApi(formattedData);

      const apiResponse = await this.getApiOrbcomm(link, messagesToSend);

      this.validateResponse(apiResponse);

      const fetchResponseId = this.addIdInResponse(apiResponse, formattedData);

      await this.updateMessagesStatus(fetchResponseId);

      console.log(fetchResponseId);
    } catch (error) {
      console.log(error.message);
      await this.prisma.orbcommLogError.create({
        data: { service: 'CHECK_MESSAGE', description: error.message },
      });
    }
  }

  addIdInResponse(
    apiResponse: ForwardStatuses,
    formattedData: FwrdIdInterface[],
  ): StatusesTypeWithId[] {
    return formattedData.map((value) => {
      const findResponse = apiResponse.Statuses.find(
        (response) =>
          value.fwrdIdValue === response.ForwardMessageID.toString(),
      );
      const fetchResponse = { ...findResponse, id: value.id };
      return fetchResponse;
    });
  }

  async messagesToUpdateStatus(): Promise<SubmittedMessages[]> {
    return await this.prisma.satelliteSendedMessages.findMany({
      where: {
        status: 'SUBMITTED',
        device: { satelliteGateway: { name: 'ORBCOMM_V2' } },
      },
      select: { id: true, satelliteValue: true },
    });
  }

  formatData(
    messagesToCheck: {
      id: number;
      satelliteValue: SatelliteValue[];
    }[],
  ): FwrdIdInterface[] {
    if (!messagesToCheck.length) {
      throw new Error('NO MORE MESSAGES TO UPDATE');
    }

    return messagesToCheck.map((message) => {
      const fwrdId = message.satelliteValue.filter(
        (satellite) => satellite.satelliteItemName === 'fwrdId',
      );
      const messages = {
        id: message.id,
        fwrdIdValue: fwrdId[0].value,
      };
      return messages;
    });
  }

  formatDataToApi(formattedData: FwrdIdInterface[]): BodyCheckApi {
    if (!formattedData.length) {
      throw new Error('NO CHECK MESSAGES TO SEND!');
    }

    const fwIDs = formattedData.map((message) => message.fwrdIdValue);

    const messageBodyCheck: MessageBodyCheck = {
      access_id: '70002657',
      password: 'ZFLLYNJL',
      fwIDs: String(fwIDs),
    };

    return messageBodyCheck;
  }
  async getApiOrbcomm(
    link: string,
    body: MessageBodyCheck,
  ): Promise<ForwardStatuses> {
    return await this.http.axiosRef
      .get(link, { params: body })
      .then((res) => res.data)
      .catch((e) => {
        throw new Error(e.message);
      });
  }

  async updateMessagesStatus(
    fetchResponseId: StatusesTypeWithId[],
  ): Promise<void> {
    fetchResponseId.forEach(async (response) => {
      if (response.State !== 0) {
        await this.prisma.satelliteSendedMessages.update({
          where: { id: response.id },
          data: {
            status: {
              set: this.convertMessageStatus(
                OrbcommMessageStatus[OrbcommStatusMap[response.State]],
              ),
            },
            satelliteValue: {
              update: {
                where: {
                  satelliteMessageId_satelliteItemName: {
                    satelliteMessageId: response.id,
                    satelliteItemName: 'statusOrbcomm',
                  },
                },
                data: {
                  value: OrbcommMessageStatus[OrbcommStatusMap[response.State]],
                },
              },
            },
          },
        });
      }
    });
  }
  convertMessageStatus(status: OrbcommMessageStatus): MessageStatus {
    switch (status) {
      case 'RECEIVED':
      case 'TRANSMITTED':
        return 'SENDED';
      case 'SUBMITTED':
      case 'WAITING':
        return 'SUBMITTED';
      case 'TIMEOUT':
        return 'TIMEOUT';
      case 'DELIVERY_FAILED':
      case 'ERROR':
      case 'INVALID':
        return 'FAILED';
      case 'CANCELLED':
        return 'CANCELLED';
    }
  }
  validateResponse(apiResponse: ForwardStatuses): void {
    if (!apiResponse.ErrorID) {
      throw new Error('REQUEST FOR FOR CHECK FAIL!');
    }
    if (apiResponse.ErrorID !== 0) {
      throw new Error(`UPDATE REQUEST FAIL IN ERROR ID ${apiResponse.ErrorID}`);
    }
  }
}
