import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MessageStatus, SatelliteValue } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ForwardStatuses,
  FwrdIdInterface,
  MessageBodyCheck,
  OrbcommMessageStatus,
  OrbcommStatusMap,
  StatusesTypeWithId,
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

      const fetchResponseId = this.addIdInResponse(apiResponse, formattedData);

      const updatedMessages = await this.updateMessagesStatus(fetchResponseId);

      console.log(fetchResponseId);
      console.log(updatedMessages);
    } catch (error) {
      console.log(error.message);
    }
  }

  addIdInResponse(
    apiResponse: ForwardStatuses,
    formattedData: FwrdIdInterface[],
  ) {
    return formattedData.map((value) => {
      const findResponse = apiResponse.Statuses.find(
        (response) =>
          value.fwrdIdValue === response.ForwardMessageID.toString(),
      );
      const fetchResponse = { ...findResponse, id: value.id };
      return fetchResponse;
    });
  }

  async messagesToUpdateStatus() {
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
      throw new Error('no more messages to update');
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

  formatDataToApi(formattedData: FwrdIdInterface[]) {
    if (!formattedData.length) {
      throw new Error('no check messages to send!');
    }

    const fwIDs = formattedData.map((message) => message.fwrdIdValue);

    const messageBodyCheck: MessageBodyCheck = {
      access_id: '70002657',
      password: 'ZFLLYNJL',
      fwIDs: String(fwIDs),
    };

    return messageBodyCheck;
  }
  async getApiOrbcomm(link: string, body: MessageBodyCheck) {
    return await this.http.axiosRef
      .get(link, { params: body })
      .then((res) => res.data)
      .catch((e) => {
        throw new Error(e.message);
      });
  }

  async updateMessagesStatus(fetchResponseId: StatusesTypeWithId[]) {
    return fetchResponseId.forEach(async (response) => {
      if (response.State !== 0) {
        return await this.prisma.satelliteSendedMessages.update({
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
}
