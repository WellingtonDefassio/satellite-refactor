import { MessageStatus } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class SendedResponseDto {
  @Expose()
  id: number;

  @Expose()
  payload: string;

  @Expose()
  status: MessageStatus;

  @Exclude()
  createdAt: Date;

  @Expose({ name: 'date' })
  date() {
    return this.createdAt.toISOString().slice(0, 19).replace('T', ' ');
  }

  constructor(partial: Partial<SendedResponseDto>) {
    Object.assign(this, partial);
  }
}
