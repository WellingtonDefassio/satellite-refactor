import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Serialize } from 'src/satellite/interceptors/serialize.interceptor';
import { SendMessageDto } from './dtos/post-send-messages.dto';
import { FetchDevice } from './pipes/transform-device.pipe';
import { FindEmittedMessagesDto } from './dtos/get-emitted-messages-query.dto';
import { SatelliteService } from './satellite.service';
import { FindSendMessagesDto } from './dtos/get-send-messages-query.dto';

@Controller('satellite')
export class SatelliteController {
  constructor(private satelliteService: SatelliteService) {}

  @UsePipes(FetchDevice)
  @Post('send-messages')
  async postMessage(@Body() body: SendMessageDto) {
    try {
      return this.satelliteService.createSendMessage(body);
    } catch (error) {
      throw Error(error.message);
    }
  }

  @Get('send-messages')
  async getMessage(@Query() params: FindSendMessagesDto) {
    try {
      return await this.satelliteService.getSendedMessages(params);
    } catch (error) {
      console.log(error.message);
    }
  }

  @Get('emitted-messages')
  async getDownloadMessages(
    @Query()
    params: FindEmittedMessagesDto,
  ) {
    try {
      return await this.satelliteService.getEmittedMessages(params);
    } catch (error) {
      console.log(error.message);
    }
  }
}
