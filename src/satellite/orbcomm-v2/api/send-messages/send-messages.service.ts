import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SatelliteSendedMessages } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  MessageBodyPost,
  Submission,
  SubmitResponse,
} from '../../interfaces/orbcomm-interfaces';

@Injectable()
export class SendMessagesService {
  constructor(private prisma: PrismaService, private http: HttpService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async sendMessage() {
    try {
      console.log('SEND MESSAGE SERVICE START...');

      const link = process.env.ORBCOMM_SUBMIT_MESSAGE;

      const messages = await this.getMessagesWithCreatedStatus();
      const formattedMessages = this.formatMessageToPost(messages);

      const apiResponse = await this.postApiOrbcomm(link, formattedMessages);

      const validatedResponse = this.validateApiReturn(apiResponse);

      await this.updateMessageStatus(validatedResponse);
    } catch (error) {
      console.log(error.message);
      await this.prisma.orbcommLogError.create({
        data: { service: 'SEND_MESSAGES', description: error.message },
      });
    }
  }

  async getMessagesWithCreatedStatus(): Promise<SatelliteSendedMessages[]> {
    const listOfCreatedOrbcomm =
      await this.prisma.satelliteSendedMessages.findMany({
        where: {
          AND: [
            { status: { equals: 'CREATED' } },
            { device: { satelliteServiceName: { equals: 'ORBCOMM_V2' } } },
          ],
        },
      });
    if (!listOfCreatedOrbcomm.length) {
      throw new Error('NO MORE MESSAGES TO SEND');
    } else return listOfCreatedOrbcomm;
  }

  formatMessageToPost(
    messagesCreated: SatelliteSendedMessages[],
  ): MessageBodyPost {
    const messageBodyPost: MessageBodyPost = {
      access_id: process.env.ACCESS_ID,
      password: process.env.PASSWORD,
      messages: [],
    };

    messagesCreated.forEach((message) =>
      messageBodyPost.messages.push({
        DestinationID: message.deviceId,
        UserMessageID: message.id,
        RawPayload: this.hexToBuffer(message.payload),
      }),
    );
    return messageBodyPost;
  }
  hexToBuffer(payload: string) {
    const result = Buffer.from(payload, 'hex');
    return [...result];
  }

  async postApiOrbcomm(
    link: string,
    formattedMessages: MessageBodyPost,
  ): Promise<SubmitResponse> {
    return await this.http.axiosRef
      .post(link, formattedMessages)
      .then((res) => res.data)
      .catch((e) => {
        throw new Error(e.message);
      });
  }

  async updateMessageStatus(submissions: Submission[]) {
    return submissions.map(async (message) => {
      return await this.prisma.satelliteSendedMessages.update({
        where: { id: message.UserMessageID },
        data: {
          status: 'SUBMITTED',
          satelliteSpecificValues: {
            create: [
              {
                value: message.ForwardMessageID.toString(),
                sendedAttribute: {
                  connect: {
                    attribute_satelliteServiceName: {
                      attribute: 'fwrdId',
                      satelliteServiceName: 'ORBCOMM_V2',
                    },
                  },
                },
              },
              {
                value: 'SUBMITTED',
                sendedAttribute: {
                  connect: {
                    attribute_satelliteServiceName: {
                      attribute: 'status',
                      satelliteServiceName: 'ORBCOMM_V2',
                    },
                  },
                },
              },
            ],
          },
        },
      });
    });
  }

  validateApiReturn(apiResponse: SubmitResponse): Submission[] {
    if (apiResponse.ErrorID !== 0) {
      throw new Error(
        `ERROR IN POST MESSAGE API ERROR ID ${apiResponse.ErrorID}`,
      );
    }
    const apiValidatedResponse = apiResponse.Submissions.filter(
      (message) => !message.ErrorID,
    );
    if (!apiValidatedResponse.length) {
      throw new Error(
        'MESSAGE NOT ACCEPT FOR THE API SATELLITE, WILL TRY AGAIN SON',
      );
    }
    return apiValidatedResponse;
  }
}
