import { Exclude, Expose } from 'class-transformer';

export class DownloadResponseDto {
  id: number;

  messageId: string;

  @Exclude()
  messageUTC: Date;
  @Expose({ name: 'dateUTC' })
  dateUTC() {
    return this.messageUTC.toISOString().slice(0, 19).replace('T', ' ');
  }

  @Exclude()
  receiveUTC: Date;

  deviceId: string;

  SIN: number;

  MIN: number;

  payload: string;

  @Exclude()
  regionName: string;

  otaMessageSize: number;
  @Exclude()
  costumerID: number;
  @Exclude()
  transport: number;

  mobileOwnerID: string;

  constructor(partial: Partial<DownloadResponseDto>) {
    Object.assign(this, partial);
  }
}
