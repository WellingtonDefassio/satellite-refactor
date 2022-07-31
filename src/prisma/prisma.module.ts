import { Module } from '@nestjs/common';
import { FetchDevice } from 'src/pipes/transform-device.pipe';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService, FetchDevice],
  exports: [PrismaService],
  imports: [PrismaModule],
})
export class PrismaModule {}
