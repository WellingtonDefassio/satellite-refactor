import { MessageStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  isArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
} from 'class-validator';

export class FindSendMessagesDto {
  @IsOptional()
  @IsNumber()
  @Transform((param) => {
    return parseInt(param.value);
  })
  id: number;

  @IsOptional()
  @IsEnum(MessageStatus, {
    message: `the input value must be ${MessageStatus.SUBMITTED} ${MessageStatus.CANCELLED} ${MessageStatus.FAILED} ${MessageStatus.CREATED} ${MessageStatus.SENDED} ${MessageStatus.SUBMITTED} or ${MessageStatus.TIMEOUT}`,
  })
  status: MessageStatus;
  @IsOptional()
  @IsString()
  deviceId: string;

  @IsOptional()
  @IsNumber()
  @Max(500)
  @Transform((param) => {
    return parseInt(param.value);
  })
  limit?: number = 100;

  @IsDate()
  @IsOptional()
  @Transform((param) => {
    const lastDate = maxDays();
    const dateUTC = param.value.endsWith('Z') ? param.value : param.value + 'Z';
    const dateParam = new Date(dateUTC);
    if (lastDate > dateParam || param.value === undefined) {
      return lastDate;
    }
    return dateParam;
  })
  startDate: Date = maxDays();

  @IsArray()
  @IsOptional()
  @Transform((param) => {
    const listOfString = param.value.split(',');
    const listOfNumber = listOfString.map((number) => {
      return parseInt(number);
    });
    return listOfNumber;
  })
  ids: number[];
}

function maxDays() {
  const maxDays = 5;
  return new Date(new Date().setDate(new Date().getDate() - maxDays));
}
