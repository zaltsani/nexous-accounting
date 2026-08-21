import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiResponse } from "@nexous-accounting/types";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        return {
          statusCode: response.statusCode,
          message: "Success",
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
