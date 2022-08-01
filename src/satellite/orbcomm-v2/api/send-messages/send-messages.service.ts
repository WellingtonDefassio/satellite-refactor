import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MessageStatus, SatelliteSendedMessages } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

interface MessageBodyPost {
  access_id: string;
  password: string;
  messages: MessagesPost[];
}

export enum OrbcommStatusMap {
  SUBMITTED = 0,
  RECEIVED = 1,
  ERROR = 2,
  DELIVERY_FAILED = 3,
  TIMEOUT = 4,
  CANCELLED = 5,
  WAITING = 6,
  INVALID = 7,
  TRANSMITTED = 8,
}

enum OrbcommMessageStatus {
  SUBMITTED = 'SUBMITTED',
  RECEIVED = 'RECEIVED',
  ERROR = 'ERROR',
  DELIVERY_FAILED = 'DELIVERY_FAILED',
  TIMEOUT = 'TIMEOUT',
  CANCELLED = 'CANCELLED',
  WAITING = 'WAITING',
  INVALID = 'INVALID',
  TRANSMITTED = 'TRANSMITTED',
}

interface MessagesPost {
  DestinationID: string;
  UserMessageID: number;
  RawPayload: number[];
}
export interface SubmitResponse {
  ErrorID: number;
  Submissions: Submission[];
}

export interface Submission {
  ForwardMessageID: number;
  DestinationID: string;
  ErrorID: number;
  UserMessageID: number;
}

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
      console.log(apiResponse);

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
          satelliteItemId: 1,
          value: message.ForwardMessageID.toString(),
        },
      });
      await this.prisma.satelliteItensRegister.create({
        data: {
          satelliteMessageId: message.UserMessageID,
          satelliteItemId: 2,
          value: this.convertMessageStatus(
            OrbcommMessageStatus[OrbcommStatusMap[message.ErrorID]],
          ),
        },
      });
    });
  }
  convertMessageStatus(status: OrbcommMessageStatus): MessageStatus {
    switch (status) {
      case 'RECEIVED':
      case 'TRANSMITTED':
        return 'SENDED';
      case 'SUBMITTED':
      case 'WAITING':
        return 'SUBMITTED';
      case 'TIMEOUT':
        return 'TIMEOUT';
      case 'DELIVERY_FAILED':
      case 'ERROR':
      case 'INVALID':
        return 'FAILED';
      case 'CANCELLED':
        return 'CANCELLED';
    }
  }
}
