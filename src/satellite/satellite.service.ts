import { Injectable } from '@nestjs/common';
import { SatelliteEmittedMessages } from '@prisma/client';
import { SendMessageDto } from '../dtos/satellite.dto';
import { PrismaService } from '../prisma/prisma.service';
import { DownloadResponseDto } from './dtos/download-messages.dto';
import { findEmittedMessagesDto } from './dtos/download-messages.query';

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

  async getEmittedMessages(param: findEmittedMessagesDto) {
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
    const formattedMessages = this.applyAdjustment(emittedMessages);

    const nextDate = formattedMessages[formattedMessages.length - 1].dateUtc
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    if (!formattedMessages.length) {
      return formattedMessages;
      //TODO tratar o retorno de resultados vazios
    }
    const emittedMessagesFormatted = formattedMessages.map((data) => {
      return new DownloadResponseDto(data);
    });

    return { nextDate, data: emittedMessagesFormatted };
  }

  applyAdjustment(emittedMessages: SatelliteEmittedMessages[]) {
    const orderMessages = this.orderMessagesByDate(emittedMessages);
    const messagesWithoutDuplicates =
      this.deleteLastDateIfDuplicate(orderMessages);

    return messagesWithoutDuplicates;
  }

  orderMessagesByDate(downloadMessagesList: SatelliteEmittedMessages[]) {
    const result = [...downloadMessagesList].sort(
      (data, data2) => data.dateUtc.getTime() - data2.dateUtc.getTime(),
    );
    return result;
  }
  deleteLastDateIfDuplicate(orderedList: SatelliteEmittedMessages[]) {
    const newOrderedList = [...orderedList];
    if (
      newOrderedList[newOrderedList.length - 1].dateUtc.getTime() ===
      newOrderedList[newOrderedList.length - 2].dateUtc.getTime()
    ) {
      newOrderedList.pop();
      return this.deleteLastDateIfDuplicate(newOrderedList);
    } else {
      newOrderedList.pop();
      return newOrderedList;
    }
  }
}
