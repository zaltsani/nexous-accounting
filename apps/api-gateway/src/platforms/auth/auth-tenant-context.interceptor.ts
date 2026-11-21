import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { TenantContext } from '@nexous-accounting/common';
import { Observable } from 'rxjs';
import { AuthRequest } from './auth.types';

@Injectable()
export class AuthTenantContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') return next.handle();

    const auth = context.switchToHttp().getRequest<AuthRequest>().auth;
    if (!auth?.tenantId) return next.handle();

    const store = { tenantId: auth.tenantId, userId: auth.userId };
    return new Observable((subscriber) =>
      TenantContext.run(store, () => next.handle().subscribe(subscriber)),
    );
  }
}
