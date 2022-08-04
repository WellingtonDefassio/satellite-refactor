import { Injectable } from '@nestjs/common';
import { OrbcommDownloadMessages } from '@prisma/client';
import { ArgumentOutOfRangeError, filter } from 'rxjs';
import { SendMessageDto } from '../dtos/satellite.dto';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDownloadParamsDto } from './dtos/download-messages.query';

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

  async downloadMessagesAll(param: QueryDownloadParamsDto) {
    const { limit, device, startDate, mobileId } = param;

    const data = await this.prisma.orbcommDownloadMessages.findMany({
      where: {
        deviceId: device,
        messageUTC: { gt: startDate },
        mobileOwnerID: mobileId,
      },
      take: limit,
    });

    const nextDate = this.nextMessageToFind(data);

    if (!data.length) {
      return data;
      //TODO tratar o retorno de resultados vazios
    }
    return {
      nextDate,
      data,
    };
  }

  nextMessageToFind(downloadMessagesList: OrbcommDownloadMessages[]) {
    const result = downloadMessagesList.sort(
      (data, data2) =>
        new Date(data.messageUTC).getTime() -
        new Date(data2.messageUTC).getTime(),
    );
    const lastRegister = result[result.length - 1];

    console.log(lastRegister);
    const { messageUTC } = lastRegister;

    return messageUTC;
  }
}
