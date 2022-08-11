import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CheckMessagesStatusService } from './check-messages-status.service';

const mockHttpReturn = {
  data: {
    ErrorID: 0,
    Statuses: {
      ForwardMessageID: 12345,
      IsClosed: true,
      State: 3,
      StateUTC: 'string',
      ReferenceNumber: 1,
      Transport: 'string',
      RegionName: 'string',
    },
  },
};

const mockFindManySatelliteSendedMessages = [
  {
    id: 1,
    satelliteSpecificValues: [
      {
        id: 1,
        value: '123456789',
        sendedMessageId: 1,
        attributeName: 'fwrdId',
        satelliteServiceName: 'ORBCOMM_V2',
      },
      {
        id: 2,
        value: 'SUBMITTED',
        sendedMessageId: 1,
        attributeName: 'status',
        satelliteServiceName: 'ORBCOMM_V2',
      },
    ],
  },
];

describe('CheckMessagesStatusService', () => {
  let service: CheckMessagesStatusService;
  let prisma: PrismaService;
  let http: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckMessagesStatusService,
        {
          provide: PrismaService,
          useValue: {
            satelliteSendedMessages: {
              findMany: jest
                .fn()
                .mockResolvedValue(mockFindManySatelliteSendedMessages),
            },
            orbcommLogError: {
              create: jest.fn().mockResolvedValue('?'),
            },
          },
        },
        {
          provide: HttpService,
          useValue: {
            axiosRef: { get: jest.fn().mockResolvedValue(mockHttpReturn) },
          },
        },
      ],
    }).compile();

    service = module.get<CheckMessagesStatusService>(
      CheckMessagesStatusService,
    );
    prisma = module.get<PrismaService>(PrismaService);
    http = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should throw if messagesToUpdateStatus not found any data', async () => {
    jest
      .spyOn(prisma.satelliteSendedMessages, 'findMany')
      .mockResolvedValueOnce([]);

    const spyOrbcommLogError = jest.spyOn(prisma.orbcommLogError, 'create');

    await service.checkMessagesStatus();

    expect(spyOrbcommLogError).toBeCalledWith({
      data: {
        service: 'CHECK_MESSAGE',
        description: 'NO MORE MESSAGES TO UPDATE',
      },
    });
  });
  it('should throw if httpResponse ErrorID is undefined', async () => {
    jest
      .spyOn(http.axiosRef, 'get')
      .mockResolvedValueOnce({ data: { any: 'any' } });

    const spyOrbcommLogError = jest.spyOn(prisma.orbcommLogError, 'create');

    await service.checkMessagesStatus();

    expect(spyOrbcommLogError).toBeCalledWith({
      data: {
        service: 'CHECK_MESSAGE',
        description: 'REQUEST FOR CHECK FAIL!',
      },
    });
  });
  it('should throw if httpResponse ErrorID is different then zero', async () => {
    jest
      .spyOn(http.axiosRef, 'get')
      .mockResolvedValueOnce({ data: { ErrorID: 333 } });

    const spyOrbcommLogError = jest.spyOn(prisma.orbcommLogError, 'create');

    await service.checkMessagesStatus();

    expect(spyOrbcommLogError).toBeCalledWith({
      data: {
        service: 'CHECK_MESSAGE',
        description: 'UPDATE REQUEST FAIL IN ERROR ID 333',
      },
    });
  });
});
