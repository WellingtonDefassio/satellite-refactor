import { DeviceStatus } from '@prisma/client';
import {
  IsEnum,
  IsHexadecimal,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

class DeviceInfoDto {
  @IsNumber()
  id: number;
  @IsNumber()
  deviceId: number;
  @IsEnum(DeviceStatus)
  status: DeviceStatus;
}

export class SendMessageDto {
  @IsNotEmpty()
  deviceId: string;
  @IsNotEmpty()
  @IsString()
  @IsHexadecimal()
  payload: string;
  device: DeviceInfoDto;
}
