import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString, Max } from 'class-validator';

export class FindEmittedMessagesDto {
  @IsString()
  @IsOptional()
  device?: string;

  @IsOptional()
  @IsNumber()
  @Max(500)
  @Transform((param) => {
    console.log(param);
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

  @IsOptional()
  @IsNumber()
  @Transform((param) => {
    return parseInt(param.value);
  })
  messageSize: number;
}

function maxDays() {
  const maxDays = 10;
  return new Date(new Date().setDate(new Date().getDate() - maxDays));
}
