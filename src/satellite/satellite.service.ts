import { Injectable } from '@nestjs/common';
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

    return await this.prisma.orbcommDownloadMessages.findMany({
      take: limit,
      where: {
        deviceId: device,
        messageUTC: { gte: startDate },
        mobileOwnerID: mobileId,
      },
    });
  }
}
