import { DynamicModule, Global, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TenantContextInterceptor } from "./tenant-context.interceptor.js";
import {
  TENANT_DATABASE_OPTIONS,
  TenantDatabaseManager,
  TenantDatabaseOptions,
  TenantDisconnectable,
} from "./tenant-database.manager.js";

@Global()
@Module({})
export class TenantDatabaseModule {
  static forRoot<T extends TenantDisconnectable>(options: TenantDatabaseOptions<T>): DynamicModule {
    return {
      module: TenantDatabaseModule,
      providers: [
        { provide: TENANT_DATABASE_OPTIONS, useValue: options },
        { provide: APP_INTERCEPTOR, useClass: TenantContextInterceptor },
        TenantDatabaseManager,
      ],
      exports: [TenantDatabaseManager],
    };
  }
}
