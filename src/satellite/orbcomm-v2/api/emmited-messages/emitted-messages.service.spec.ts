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

const mockHttpReturnWithPayload = {
  data: {
    ErrorID: 0,
    NextStartUTC: '2022-07-06 19:25:33',
    Messages: [
      {
        ID: 11326754042,
        MessageUTC: '2022-07-06 17:13:52',
        ReceiveUTC: '2022-07-06 17:13:52',
        SIN: 130,
        MobileID: '01597865SKYFA8A',
        RawPayload: [
          130, 7, 19, 98, 197, 194, 179, 193, 212, 150, 22, 194, 73, 183, 163,
          0, 10,
        ],
        Payload: {
          Name: 'modemRegistration',
          SIN: 0,
          MIN: 0,
          Fields: [
            {
              Name: 'hardwareMajorVersion',
              Value: '5',
            },
            {
              Name: 'hardwareMinorVersion',
              Value: '0',
            },
            {
              Name: 'softwareMajorVersion',
              Value: '3',
            },
            {
              Name: 'softwareMinorVersion',
              Value: '3',
            },
            {
              Name: 'product',
              Value: '6',
            },
            {
              Name: 'wakeupPeriod',
              Value: 'None',
            },
            {
              Name: 'lastResetReason',
              Value: 'NewVirtualCarrier',
            },
            {
              Name: 'virtualCarrier',
              Value: '501',
            },
            {
              Name: 'beam',
              Value: '1',
            },
            {
              Name: 'vain',
              Value: '0',
            },
            {
              Name: 'reserved',
              Value: '0',
            },
            {
              Name: 'operatorTxState',
              Value: '0',
            },
            {
              Name: 'userTxState',
              Value: '0',
            },
            {
              Name: 'broadcastIDCount',
              Value: '0',
            },
          ],
        },
        RegionName: 'AORWSC',
        OTAMessageSize: 17,
        CustomerID: 0,
        Transport: 1,
        MobileOwnerID: 60002657,
      },
    ],
  },
};

const mockSatelliteEmittedMessagesCreated = {
  id: 1,
  payload: '0000050003030600011f510000',
  device: 'ABCDEVICE',
  messageSize: 10,
  dateUtc: new Date('11/08/2022'),
};
const mockParamControlFindFirst = { nextMessage: '2020-06-07 22:13:23' };

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
              findFirst: jest.fn().mockResolvedValue(mockParamControlFindFirst),
              create: jest.fn().mockResolvedValue(''),
            },
            orbcommLogError: {
              create: jest.fn().mockResolvedValue(''),
            },
            satelliteEmittedMessages: {
              create: jest
                .fn()
                .mockResolvedValue(mockSatelliteEmittedMessagesCreated),
            },
            satelliteEmittedSpecificValues: {
              create: jest.fn().mockResolvedValue(''),
            },
            orbcommMobileVersion: {
              upsert: jest.fn().mockResolvedValue(''),
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
  it('will throw if ParamControl not found any data.', async () => {
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
        ErrorID: 0,
        Messages: null,
      },
    });

    const spyOrbcommLogError = jest.spyOn(prisma.orbcommLogError, 'create');

    await service.downloadMessages();

    expect(spyOrbcommLogError).toBeCalledWith({
      data: {
        service: 'EMITTED_MESSAGES',
        description: 'THIS REQUEST NOT RETURN ANY MESSAGES',
      },
    });
  });
  it('should call satelliteEmittedMessages create when download is call ', async () => {
    const spySatelliteEmittedMessages = jest.spyOn(
      prisma.satelliteEmittedMessages,
      'create',
    );

    await service.downloadMessages();

    expect(spySatelliteEmittedMessages).toBeCalledTimes(1);
  });
  it('should not call orbcommMobileVersion upsert when api response dont have a Payload device ', async () => {
    const spySatelliteEmittedMessages = jest.spyOn(
      prisma.orbcommMobileVersion,
      'upsert',
    );

    await service.downloadMessages();

    expect(spySatelliteEmittedMessages).toBeCalledTimes(0);
  });
  it('should call orbcommMobileVersion upsert when api response have a Payload device ', async () => {
    jest
      .spyOn(http.axiosRef, 'get')
      .mockResolvedValueOnce(mockHttpReturnWithPayload);

    const spySatelliteEmittedMessages = jest.spyOn(
      prisma.orbcommMobileVersion,
      'upsert',
    );

    await service.downloadMessages();

    expect(spySatelliteEmittedMessages).toBeCalledTimes(1);
  });
  it('createNextUtcParam will be call with the return of findNextMessage + return NextStartUTC from api', async () => {
    const spyOrbcommCreateParam = jest.spyOn(
      prisma.orbcommDownloadParamControl,
      'create',
    );
    await service.downloadMessages();
    expect(spyOrbcommCreateParam).toBeCalledWith({
      data: {
        nextMessage: mockHttpReturn.data.NextStartUTC,
        previousMessage: mockParamControlFindFirst.nextMessage,
      },
    });
  });
});
