import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { SatelliteEmittedMessages } from '@prisma/client';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from '../../../../prisma/prisma.service';
import { EmittedMessagesServices } from './emitted-messages.service';

describe('DownloadMessagesService', () => {
  let service: EmittedMessagesServices;
  const fakePrismaService: Partial<PrismaService> = {
    orbcommDownloadParamControl: {
      findFirst: () => Promise.resolve({}),
    },
  };
  const fakeHttpService = {
    axiosRef: {
      get: () => Promise.resolve([]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmittedMessagesServices,
        { provide: PrismaService, useValue: fakePrismaService },
        { provide: HttpService, useValue: fakeHttpService },
      ],
    }).compile();

    service = module.get<EmittedMessagesServices>(EmittedMessagesServices);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
