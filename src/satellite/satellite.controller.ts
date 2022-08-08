import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { SendMessageDto } from '../dtos/satellite.dto';
import { FetchDevice } from '../pipes/transform-device.pipe';
import { findEmittedMessagesDto } from './dtos/download-messages.query';
import { SatelliteService } from './satellite.service';

@Controller('satellite')
export class SatelliteController {
  constructor(private satelliteService: SatelliteService) {}

  @UsePipes(FetchDevice)
  @Post('send-messages')
  async sendMessage(@Body() body: SendMessageDto) {
    try {
      console.log('Controller body :' + JSON.stringify(body));
      return this.satelliteService.createSendMessage(body);
    } catch (error) {
      throw Error(error.message);
    }
  }

  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @Get('emitted-messages')
  async getDownloadMessages(
    @Query()
    params: findEmittedMessagesDto,
  ) {
    try {
      return await this.satelliteService.getEmittedMessages(params);
    } catch (error) {
      console.log(error.message);
    }
  }
}
