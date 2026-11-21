import { Module } from "@nestjs/common";
import { TenantDatabaseProvisioner } from "./tenant-database.provisioner";
import { TenantsController } from "./tenants.controller";
import { TenantsService } from "./tenants.service";
import { TenantMigrator } from "./tenant-migrator.service";
import { buildTenantSchemas, TENANT_SCHEMAS } from "./tenant-schemas.config";
import { ConfigService } from "@nestjs/config";

@Module({
  controllers: [TenantsController],
  providers: [
    TenantsService,
    TenantDatabaseProvisioner,
    TenantMigrator,
    { provide: TENANT_SCHEMAS, inject: [ConfigService], useFactory: buildTenantSchemas },
  ],
  exports: [TenantsService],
})
export class TenantsModule {}
