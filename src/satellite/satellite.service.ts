import { Injectable } from '@nestjs/common';
import { ArgumentOutOfRangeError, filter } from 'rxjs';
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

  async downloadMessagesAll(body: Body) {
    //TODO implementar um decorator que transforma em int e valida o maxSize
    const maxResponsePag = 20;

    const where = body.where.deviceId;
    const take = body.take ? body.take : 5;
    const skip = body.skip * take ? body.skip : 0;

    console.log(body);

    return await this.prisma.orbcommDownloadMessages.findMany({
      where: { deviceId: where },
      take,
      skip,
    });
  }
}

interface Body {
  where?: {
    deviceId: string;
  };
  take?: number;
  skip?: number;
}
