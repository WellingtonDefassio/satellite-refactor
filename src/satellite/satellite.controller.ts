import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
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
  async downloadMessages() {
    try {
      return await this.satelliteService.downloadMessagesAll();
    } catch (error) {}
  }
}
