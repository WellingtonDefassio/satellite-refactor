import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SatelliteSendedMessages } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  MessageBodyPost,
  SubmitResponse,
} from '../../interfaces/orbcomm-interfaces';

@Injectable()
export class SendMessagesService {
  constructor(private prisma: PrismaService, private http: HttpService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async sendMessage() {
    try {
      console.log('SEND MESSAGE SERVICE START...');

      const link = process.env.ORBCOMM_SUBMIT_MESSAGE;

      const messages = await this.getMessagesWithCreatedStatus();
      const formattedMessages = this.formatMessageToPost(messages);

      const apiResponse = await this.postApiOrbcomm(link, formattedMessages);
      this.validateApiReturn(apiResponse);

      await this.updateMessageStatus(apiResponse);

      console.log(apiResponse);
    } catch (error) {
      console.log(error.message);
    }
  }

  async getMessagesWithCreatedStatus(): Promise<SatelliteSendedMessages[]> {
    const listOfCreatedOrbcomm =
      await this.prisma.satelliteSendedMessages.findMany({
        where: {
          AND: [
            { status: 'CREATED' },
            {
              device: { satelliteGateway: { name: { equals: 'ORBCOMM_V2' } } },
            },
          ],
        },
      });
    if (!listOfCreatedOrbcomm.length) {
      throw new Error('no more messages to send!');
    } else return listOfCreatedOrbcomm;
  }

  formatMessageToPost(messagesCreated: SatelliteSendedMessages[]) {
    const messageBodyPost: MessageBodyPost = {
      access_id: '70002657',
      password: 'ZFLLYNJL',
      messages: [],
    };

    messagesCreated.forEach((message) =>
      messageBodyPost.messages.push({
        DestinationID: message.deviceId,
        UserMessageID: message.id,
        RawPayload: this.hexToBuffer(message.payload),
      }),
    );

    console.log(messageBodyPost);
    return messageBodyPost;
  }
  hexToBuffer(payload: string) {
    const result = Buffer.from(payload, 'hex');
    return [...result];
  }

  async postApiOrbcomm(link: string, formattedMessages: MessageBodyPost) {
    return await this.http.axiosRef
      .post(link, formattedMessages)
      .then((res) => res.data)
      .catch((e) => {
        throw new Error(e.message);
      });
  }

  async updateMessageStatus(apiResponse: SubmitResponse) {
    apiResponse.Submissions.map(async (message) => {
      await this.prisma.satelliteSendedMessages.update({
        where: { id: message.UserMessageID },
        data: { status: 'SUBMITTED' },
      });
      await this.prisma.satelliteItensRegister.create({
        data: {
          satelliteMessageId: message.UserMessageID,
          value: message.ForwardMessageID.toString(),
          satelliteItemName: 'fwrdId',
        },
      }),
        await this.prisma.satelliteItensRegister.create({
          data: {
            satelliteMessageId: message.UserMessageID,
            satelliteItemName: 'statusOrbcomm',
            value: 'SUBMITTED',
          },
        });
    });
  }

  validateApiReturn(apiResponse: SubmitResponse) {
    if (apiResponse.ErrorID !== 0) {
      throw new Error(
        `error in post message api error id ${apiResponse.ErrorID}`,
      );
    }
  }
}
