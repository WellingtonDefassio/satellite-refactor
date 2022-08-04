import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { OrbcommDownloadMessages } from '@prisma/client';
import { Observable, map } from 'rxjs';

interface ReturnFindAll {
  data: OrbcommDownloadMessages[];
  nextDate: Date;
}

export class DownloadResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map(({ data, nextDate }: ReturnFindAll) => {
        const nextDateBodyResponse = nextDate
          .toISOString()
          .slice(0, 19)
          .replace('T', ' ');

        const bodyResponse = data.map((v: OrbcommDownloadMessages) => ({
          idMessage: v.id,
          deviceId: v.deviceId,
          messageUtc: v.messageUTC.toISOString().slice(0, 19).replace('T', ' '),
          SIN: v.SIN,
          MIN: v.MIN,
          payload: v.payload,
          messageSize: v.otaMessageSize,
          mobileOwnerId: v.mobileOwnerID,
        }));
        return { nextDate: nextDateBodyResponse, data: [...bodyResponse] };
      }),
    );
  }
}
