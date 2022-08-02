import { Injectable } from '@nestjs/common';
import { SendMessageDto } from '../dtos/satellite.dto';
import { PrismaService } from '../prisma/prisma.service';

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

  async downloadMessagesAll() {
    return await this.prisma.orbcommDownloadMessages.findMany();
  }
}
