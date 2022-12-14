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
    const { status, deviceId, limit, startDate, ids } = param;
    const idsExists = ids !== undefined;

    if (!idsExists) {
      const findManySendedMessages =
        await this.prisma.satelliteSendedMessages.findMany({
          where: { deviceId, status, createdAt: { gt: startDate } },
          take: limit + 1,
        });

      if (!findManySendedMessages.length) return findManySendedMessages;

      const orderedList = this.orderMessagesByDate(
        findManySendedMessages,
        'createdAt',
      );

      const correctList = this.deleteLastDateIfDuplicate(
        orderedList,
        'createdAt',
        limit,
      );

      const validatedMessages: SatelliteSendedMessages[] = this.applyAdjustment(
        correctList,
        'createdAt',
        limit,
      );

      const nextDateToSend = this.getLastFormattedDate(
        validatedMessages,
        'createdAt',
      );

      const sendedMessagesFormatted = validatedMessages.map((data) => {
        return new SendedResponseDto(data);
      });
      return { nextMessage: nextDateToSend, data: sendedMessagesFormatted };
    }
    if (idsExists) {
      const findManySendedMessages =
        await this.prisma.satelliteSendedMessages.findMany({
          where: { id: { in: ids } },
        });
      if (!findManySendedMessages.length) return findManySendedMessages;

      return findManySendedMessages.map((data) => {
        return new SendedResponseDto(data);
      });
    }
  }

  async getEmittedMessages(param: FindEmittedMessagesDto) {
    const { limit, device, startDate, messageSize } = param;

    const emittedMessages = await this.prisma.satelliteEmittedMessages.findMany(
      {
        where: {
          deviceId: device,
          dateUtc: { gt: startDate },
          messageSize: { gt: messageSize },
        },
        take: limit + 1,
      },
    );
    if (!emittedMessages.length) return emittedMessages;

    const formattedMessages: SatelliteEmittedMessages[] = this.applyAdjustment(
      emittedMessages,
      'dateUtc',
      limit,
    );
    const nextDate = this.getLastFormattedDate(formattedMessages, 'dateUtc');

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

  private orderMessagesByDate(list: any[], param: string) {
    const result = [...list].sort(
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
      return this.deleteLastDateIfDuplicate(newOrderedList, param, limit - 1);
    } else {
      newOrderedList.pop();
      return newOrderedList;
    }
  }
  private getLastFormattedDate(messages: any[], param: string) {
    return messages[messages.length - 1][param]
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');
  }
}
