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

    const downloadMessagesList =
      await this.prisma.orbcommDownloadMessages.findMany({
        where: {
          deviceId: device,
          messageUTC: { gte: startDate },
          mobileOwnerID: mobileId,
        },
        take: limit,
      });

    if (!downloadMessagesList.length) {
      return downloadMessagesList;
      //TODO tratar o retorno de resultados vazios
    }
    return downloadMessagesList;
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
    const date = messageUTC.setSeconds(messageUTC.getSeconds() + 1);

    console.log(new Date(date));
  }
}
