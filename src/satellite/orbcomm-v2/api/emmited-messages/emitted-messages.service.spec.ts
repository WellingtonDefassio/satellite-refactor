import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../../prisma/prisma.service';
import { EmittedMessagesServices } from './emitted-messages.service';

const mockHttpReturn = {
  data: {
    ErrorID: 0,
    NextStartUTC: '2022-08-05 20:27:49',
    Messages: [
      {
        ID: 11546515303,
        MessageUTC: '2022-08-05 19:16:30',
        ReceiveUTC: '2022-08-05 19:16:30',
        SIN: 130,
        MobileID: '01824851SKYF3DC',
        RawPayload: [130, 6, 0, 98, 237, 108, 127, 50, 49, 51, 57, 49, 50],
        RegionName: 'AORWSC',
        OTAMessageSize: 13,
        CustomerID: 0,
        Transport: 1,
        MobileOwnerID: 60002657,
      },
    ],
  },
};

describe('CheckMessagesStatusService', () => {
  let service: EmittedMessagesServices;
  let prisma: Partial<PrismaService>;
  let http: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmittedMessagesServices,
        {
          provide: PrismaService,
          useValue: {
            orbcommDownloadParamControl: {
              findFirst: jest
                .fn()
                .mockResolvedValue({ nextMessage: '2020-06-07 22:13:23' }),
            },
            orbcommLogError: {
              create: jest.fn().mockResolvedValue(''),
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

    service = module.get<EmittedMessagesServices>(EmittedMessagesServices);
    prisma = module.get<PrismaService>(PrismaService);
    http = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });
  it('will throw if ParamControl not found data.', async () => {
    jest
      .spyOn(prisma.orbcommDownloadParamControl, 'findFirst')
      .mockResolvedValueOnce({
        nextMessage: undefined,
        id: undefined,
        previousMessage: undefined,
        createdAt: undefined,
      });

    const spyOrbcommLogError = jest.spyOn(prisma.orbcommLogError, 'create');

    await service.downloadMessages();

    expect(spyOrbcommLogError).toBeCalledWith({
      data: {
        service: 'EMITTED_MESSAGES',
        description: 'orbcommDownloadParamControl not provide a return value',
      },
    });
  });
  it('will throw if axiosGET throw a error', async () => {
    jest.spyOn(http.axiosRef, 'get').mockImplementationOnce(() => {
      throw new Error('server not response');
    });
    const spyOrbcommLogError = jest.spyOn(prisma.orbcommLogError, 'create');

    await service.downloadMessages();

    expect(spyOrbcommLogError).toBeCalledWith({
      data: {
        service: 'EMITTED_MESSAGES',
        description: 'server not response',
      },
    });
  });
  it('will throw if orbcomm api response not provide a ErrorID', async () => {
    jest.spyOn(http.axiosRef, 'get').mockResolvedValueOnce({
      data: {
        notfound: 'notfound',
      },
    });

    const spyOrbcommLogError = jest.spyOn(prisma.orbcommLogError, 'create');

    await service.downloadMessages();

    expect(spyOrbcommLogError).toBeCalledWith({
      data: {
        service: 'EMITTED_MESSAGES',
        description: 'VERIFY THE DOWNLOAD MESSAGES CALL',
      },
    });
  });
  it('will throw if orbcomm api response provide a ErrorID different then zero ', async () => {
    jest.spyOn(http.axiosRef, 'get').mockResolvedValueOnce({
      data: {
        ErrorID: 666,
      },
    });

    const spyOrbcommLogError = jest.spyOn(prisma.orbcommLogError, 'create');

    await service.downloadMessages();

    expect(spyOrbcommLogError).toBeCalledWith({
      data: {
        service: 'EMITTED_MESSAGES',
        description: 'ERROR IN REQUEST API ORBCOMM VERIFY THE ERROR ID: 666',
      },
    });
  });
  it('will throw if orbcomm api response provide a ErrorID 0 but the Messages be null ', async () => {
    jest.spyOn(http.axiosRef, 'get').mockResolvedValueOnce({
      data: {
        ErrorID: 666,
      },
    });

    const spyOrbcommLogError = jest.spyOn(prisma.orbcommLogError, 'create');

    await service.downloadMessages();

    expect(spyOrbcommLogError).toBeCalledWith({
      data: {
        service: 'EMITTED_MESSAGES',
        description: 'ERROR IN REQUEST API ORBCOMM VERIFY THE ERROR ID: 666',
      },
    });
  });
});
