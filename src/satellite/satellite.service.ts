import { Injectable } from '@nestjs/common';
import {
  SatelliteEmittedMessages,
  SatelliteSendedMessages,
} from '@prisma/client';
import { SendMessageDto } from './dtos/post-send-messages.dto';
import { PrismaService } from '../prisma/prisma.service';
import { DownloadResponseDto } from './dtos/get-emitted-messages.dto';
import { FindEmittedMessagesDto } from './dtos/get-emitted-messages-query.dto';
import { FindSendMessagesDto } from './dtos/get-send-messages-query.dto';
import { SendedResponseDto } from './dtos/get-send-messages.dto';

@Injectable()
export class SatelliteService {
  constructor(private prisma: PrismaService) {}

  async createSendMessage(body: SendMessageDto) {
    return await this.prisma.satelliteSendedMessages.create({
      data: {
        payload: body.payload,
        device: { connect: { deviceId: body.deviceId } },
      },
    });
  }

  async getSendedMessages(param: FindSendMessagesDto) {
    const { id, status, deviceId, limit, startDate, ids } = param;

    if (ids === undefined) {
      const sendedMessages = await this.prisma.satelliteSendedMessages.findMany(
        {
          where: { id, deviceId, status, createdAt: { gt: startDate } },
          take: limit + 1,
        },
      );

      const formattedMessages: SatelliteSendedMessages[] = this.applyAdjustment(
        sendedMessages,
        'createdAt',
        limit,
      );

      if (!formattedMessages.length) {
        return formattedMessages;
      }

      const nextDate = formattedMessages[
        formattedMessages.length - 1
      ].createdAt.setTime(
        formattedMessages[formattedMessages.length - 1].createdAt.getTime(),
      );

      const date = new Date(nextDate)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');

      const sendedMessagesFormatted = formattedMessages.map((data) => {
        return new SendedResponseDto(data);
      });
      return { nextMessage: date, data: sendedMessagesFormatted };
    }
    if (ids !== undefined) {
      const sendedMessages = await this.prisma.satelliteSendedMessages.findMany(
        {
          where: { id: { in: ids } },
        },
      );
      return sendedMessages.map((data) => {
        return new SendedResponseDto(data);
      });
    }
  }

  async getEmittedMessages(param: FindEmittedMessagesDto) {
    const { limit, device, startDate, messageSize } = param;
    const emittedMessages = await this.prisma.satelliteEmittedMessages.findMany(
      {
        where: {
          device,
          dateUtc: { gt: startDate },
          messageSize: { gt: messageSize },
        },
        take: limit + 1,
      },
    );
    const formattedMessages = this.applyAdjustment(
      emittedMessages,
      'dateUtc',
      limit,
    );

    const nextDate = formattedMessages[formattedMessages.length - 1].dateUtc
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    if (!formattedMessages.length) {
      return formattedMessages;
    }
    const emittedMessagesFormatted = formattedMessages.map((data) => {
      return new DownloadResponseDto(data);
    });

    return { nextDate, data: emittedMessagesFormatted };
  }

  private applyAdjustment(messages: any[], param: string, limit: number) {
    const orderMessages = this.orderMessagesByDate(messages, param);
    const messagesWithoutDuplicates = this.deleteLastDateIfDuplicate(
      orderMessages,
      param,
      limit,
    );
    return messagesWithoutDuplicates;
  }

  private orderMessagesByDate(downloadMessagesList: any[], param: string) {
    const result = [...downloadMessagesList].sort(
      (data, data2) => data[param].getTime() - data2[param].getTime(),
    );
    return result;
  }
  private deleteLastDateIfDuplicate(
    orderedList: any[],
    param: string,
    limit: number,
  ) {
    const newOrderedList = [...orderedList];
    if (newOrderedList.length <= 1 || newOrderedList.length < limit) {
      return newOrderedList;
    }
    if (
      newOrderedList[newOrderedList.length - 1][param].getTime() ===
      newOrderedList[newOrderedList.length - 2][param].getTime()
    ) {
      newOrderedList.pop();
      return this.deleteLastDateIfDuplicate(newOrderedList, param, limit);
    } else {
      newOrderedList.pop();
      return newOrderedList;
    }
  }
}
