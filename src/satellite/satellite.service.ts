import { Injectable } from '@nestjs/common';
import { ArgumentOutOfRangeError, filter } from 'rxjs';
import { SendMessageDto } from '../dtos/satellite.dto';
import { PrismaService } from '../prisma/prisma.service';
import { DownloadResponseDto } from './dtos/download-messages.dto';
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
    const datas = await this.prisma.satelliteEmittedMessages.findMany({
      where: { device, dateUtc: { gt: startDate } },
      take: limit,
    });
    // const nextDate = this.nextMessageToFind(datas);

    if (!datas.length) {
      return datas;
      //TODO tratar o retorno de resultados vazios
    }

    return datas.map((data) => {
      return new DownloadResponseDto(data);
    });
  }

  nextMessageToFind(downloadMessagesList) {
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
