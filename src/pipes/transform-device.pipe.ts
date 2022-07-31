import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface bodyParams {
  deviceId: string;
  payload: string;
}

@Injectable()
export class FetchDevice implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(body: bodyParams) {
    const fetchDevice = await this.prisma.devices.findUnique({
      where: { deviceId: body.deviceId },
    });
    if (!fetchDevice) {
      throw new NotFoundException({ error: 'device not found' });
    }
    const device = {
      id: fetchDevice.id,
      gateway: fetchDevice.gatewayId,
      status: fetchDevice.status,
    };
    return { ...body, device: device };
  }
}
