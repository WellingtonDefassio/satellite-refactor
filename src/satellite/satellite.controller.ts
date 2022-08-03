import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { take } from 'rxjs';
import { SendMessageDto } from '../dtos/satellite.dto';
import { FetchDevice } from '../pipes/transform-device.pipe';
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

  @Get('download-message')
  async getDownloadMessages(
    @Query('device') deviceId?: string,
    @Query('take') take?: string,
    @Query('index') index?: string,
  ) {
    try {
      const body = {
        where: {
          deviceId,
        },
        ...(take && { take: parseInt(take) }),
        ...(index && { skip: parseInt(index) * parseInt(take) }),
      };

      return await this.satelliteService.downloadMessagesAll(body);
    } catch (error) {
      console.log(error.message);
    }
  }
}
