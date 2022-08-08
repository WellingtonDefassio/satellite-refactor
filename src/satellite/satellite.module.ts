import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { SatelliteService } from './satellite.service';
import { SatelliteController } from './satellite.controller';
import { EmittedMessagesServices } from './orbcomm-v2/api/emmited-messages/emitted-messages.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SendMessagesService } from './orbcomm-v2/api/send-messages/send-messages.service';
import { CheckMessagesStatusService } from './orbcomm-v2/api/check-messages-status/check-messages-status.service';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    SatelliteService,
    EmittedMessagesServices,
    SendMessagesService,
    CheckMessagesStatusService,
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
  controllers: [SatelliteController],
  imports: [HttpModule, PrismaModule],
})
export class SatelliteModule {}
