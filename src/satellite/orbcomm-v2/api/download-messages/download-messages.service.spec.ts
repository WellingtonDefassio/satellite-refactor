import { Test, TestingModule } from '@nestjs/testing';
import { DownloadMessagesService } from './download-messages.service';

describe('DownloadMessagesService', () => {
  let service: DownloadMessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DownloadMessagesService],
    }).compile();

    service = module.get<DownloadMessagesService>(DownloadMessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
