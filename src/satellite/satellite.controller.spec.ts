import { Test, TestingModule } from '@nestjs/testing';
import { SatelliteController } from './satellite.controller';

describe('SatelliteController', () => {
  let controller: SatelliteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SatelliteController],
    }).compile();

    controller = module.get<SatelliteController>(SatelliteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
