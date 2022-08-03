import { Expose } from 'class-transformer';

export class DownloadDto {
  @Expose()
  SIN: number;
  @Expose()
  MIN: number;
  @Expose()
  any: 'toma';
}
