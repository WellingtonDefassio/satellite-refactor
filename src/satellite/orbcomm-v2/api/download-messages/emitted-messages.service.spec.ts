import { Test, TestingModule } from '@nestjs/testing';
import { EmittedMessagesServices } from './emitted-messages.service';

describe('DownloadMessagesService', () => {
  let service: EmittedMessagesServices;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmittedMessagesServices],
    }).compile();

    service = module.get<EmittedMessagesServices>(EmittedMessagesServices);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
