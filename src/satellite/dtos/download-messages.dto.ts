import { Exclude, Expose } from 'class-transformer';

export class DownloadResponseDto {
  id: number;
  payload: string;
  device: string;
  messageSize: number;

  // @Exclude()
  dateUtc: Date;

  @Expose({ name: 'date' })
  date() {
    return this.dateUtc.toISOString().slice(0, 19).replace('T', ' ');
  }

  @Exclude()
  receiveUTC: Date;

  constructor(partial: Partial<DownloadResponseDto>) {
    Object.assign(this, partial);
  }
}
