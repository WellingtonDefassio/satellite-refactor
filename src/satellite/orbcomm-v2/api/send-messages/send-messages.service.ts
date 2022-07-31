import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SendMessagesService {
  constructor(private prisma: PrismaService, private http: HttpService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async sendMessage() {
    console.log('SEND MESSAGE SERVICE START...');

    const messagesWithCreatedStatus = await this.getMessagesWithCreatedStatus();

    console.log(messagesWithCreatedStatus);
  }

  async getMessagesWithCreatedStatus() {
    return await this.prisma.satelliteSendedMessages.findMany({
      where: {
        AND: [
          { status: 'CREATED' },
          {
            device: { satelliteGateway: { name: { equals: 'ORBCOMM_V2' } } },
          },
        ],
      },
    });
  }
}
