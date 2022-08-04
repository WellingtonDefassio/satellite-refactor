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
import { DownloadResponseInterceptor } from 'src/interceptors/download-response.interceptor';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { SendMessageDto } from '../dtos/satellite.dto';
import { FetchDevice } from '../pipes/transform-device.pipe';
import { DownloadDto } from './dtos/download-messages.dto';
import { QueryDownloadParamsDto } from './dtos/download-messages.query';
import { SatelliteService } from './satellite.service';

@Controller('satellite')
export class SatelliteController {
  constructor(private satelliteService: SatelliteService) {}

  @UsePipes(FetchDevice)
  @Post('send-message')
  async sendMessage(@Body() body: SendMessageDto) {
    try {
      console.log('Controller body :' + JSON.stringify(body));
      return this.satelliteService.createSendMessage(body);
    } catch (error) {
      throw Error(error.message);
    }
  }

  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseInterceptors(DownloadResponseInterceptor)
  @Get('download-message')
  async getDownloadMessages(
    @Query()
    params: QueryDownloadParamsDto,
  ) {
    try {
      return await this.satelliteService.downloadMessagesAll(params);
    } catch (error) {
      console.log(error.message);
    }
  }
}
