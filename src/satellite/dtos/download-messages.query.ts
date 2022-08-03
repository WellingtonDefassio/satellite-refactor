import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString, Max } from 'class-validator';

export class QueryDownloadParamsDto {
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
    const dateParam = new Date(param.value);
    console.log(param.value);
    if (lastDate > dateParam || param.value === undefined) {
      return lastDate;
    }
    return new Date(param.value);
  })
  startDate: Date = maxDays();

  @IsString()
  @IsOptional()
  mobileId?: string;
}

function maxDays() {
  const maxDays = 3;
  return new Date(new Date().setDate(new Date().getDate() - maxDays));
}
