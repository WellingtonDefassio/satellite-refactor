import { Test, TestingModule } from '@nestjs/testing';
import { CheckMessagesStatusService } from './check-messages-status.service';

describe('CheckMessagesStatusService', () => {
  let service: CheckMessagesStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckMessagesStatusService],
    }).compile();

    service = module.get<CheckMessagesStatusService>(CheckMessagesStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
