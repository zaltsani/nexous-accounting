import { CallHandler, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { ZodSerializerInterceptor } from "nestjs-zod";
import { Observable, catchError, throwError } from "rxjs";
import { ZodError } from "zod";

@Injectable()
export class DebugZodSerializerInterceptor extends ZodSerializerInterceptor {
  private readonly logger = new Logger("ZodResponse");

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return super.intercept(context, next).pipe(
      catchError((err) => {
        if (err instanceof ZodError) {
          this.logger.error("ZodResponse Serialization Failed:");
          this.logger.error(JSON.stringify(err.format(), null, 2));
        } else {
          this.logger.error(err);
        }
        return throwError(() => err);
      }),
    );
  }
}
