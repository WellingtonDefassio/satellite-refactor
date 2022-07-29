import { Module } from '@nestjs/common';
import { FetchDevice } from '../pipes/transform-device.pipe';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService, FetchDevice],
  exports: [PrismaService],
  imports: [PrismaModule],
})
export class PrismaModule {}
