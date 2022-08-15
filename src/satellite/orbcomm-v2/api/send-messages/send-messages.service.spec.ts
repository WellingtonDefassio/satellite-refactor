import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { SatelliteSendedMessages } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { SubmitResponse } from '../../interfaces/orbcomm-interfaces';
import { SendMessagesService } from './send-messages.service';

interface httpResponse {
  data: SubmitResponse;
}

describe('SendMessagesService', () => {
  let service: SendMessagesService;
  let prisma: PrismaService;
  let http: HttpService;

  const findManyCreated: SatelliteSendedMessages[] = [
    {
      id: 1,
      payload: '123456789',
      deviceId: 'DEVICE01',
      createdAt: new Date('12/08/2022'),
      status: 'CREATED',
    },
    {
      id: 1,
      payload: '123456789',
      deviceId: 'DEVICE01',
      createdAt: new Date('12/08/2022'),
      status: 'CREATED',
    },
  ];

  const mockHttpResponse: httpResponse = {
    data: {
      ErrorID: 0,
      Submissions: [
        {
          ForwardMessageID: 1,
          DestinationID: 'DEVICE01',
          ErrorID: 0,
          UserMessageID: 1,
        },
      ],
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendMessagesService,
        {
          provide: PrismaService,
          useValue: {
            satelliteSendedMessages: {
              findMany: jest.fn().mockResolvedValue(findManyCreated),
            },
            orbcommLogError: {
              create: jest.fn().mockResolvedValue('any'),
            },
          },
        },
        {
          provide: HttpService,
          useValue: {
            axiosRef: { post: jest.fn().mockResolvedValue(mockHttpResponse) },
          },
        },
      ],
    }).compile();

    service = module.get<SendMessagesService>(SendMessagesService);
    prisma = module.get<PrismaService>(PrismaService);
    http = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('will throw a error if no created Messages is find', async () => {
    jest
      .spyOn(prisma.satelliteSendedMessages, 'findMany')
      .mockResolvedValueOnce([]);

    const spyLogError = jest.spyOn(prisma.orbcommLogError, 'create');

    await service.sendMessage();

    expect(spyLogError).toHaveBeenCalledWith({
      data: {
        service: 'SEND_MESSAGE',
        description: 'NO MORE MESSAGES TO SEND',
      },
    });
  });
  it('will throw a error if ApiResponse ErrorID is different of zero', async () => {
    jest
      .spyOn(http.axiosRef, 'post')
      .mockResolvedValueOnce({ data: { ErrorID: 222 } });

    const spyLogError = jest.spyOn(prisma.orbcommLogError, 'create');

    await service.sendMessage();

    expect(spyLogError).toHaveBeenCalledWith({
      data: {
        description: 'ERROR IN POST MESSAGE API ERROR ID 222',
        service: 'SEND_MESSAGES',
      },
    });
  });
  it('will throw a error if ApiResponse ErrorID inside Submissions not defined ', async () => {
    jest.spyOn(http.axiosRef, 'post').mockResolvedValueOnce({
      data: { ErrorID: 0, Submissions: [{ ErrorID: 2 }] },
    });

    const spyLogError = jest.spyOn(prisma.orbcommLogError, 'create');

    await service.sendMessage();

    expect(spyLogError).toHaveBeenCalledWith({
      data: {
        description:
          'MESSAGE NOT ACCEPT FOR THE API SATELLITE, WILL TRY AGAIN SON',
        service: 'SEND_MESSAGES',
      },
    });
  });
});
