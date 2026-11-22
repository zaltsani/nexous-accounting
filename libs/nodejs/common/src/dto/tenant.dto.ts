import {
  addTenantMemberSchema,
  createTenantSchema,
  tenantMembershipSchema,
  tenantSchema,
} from "@nexous-accounting/types";
import { createZodDto } from "nestjs-zod";

export class TenantDto extends createZodDto(tenantSchema) {}
export class CreateTenantDto extends createZodDto(createTenantSchema) {}
export class AddTenantMemberDto extends createZodDto(addTenantMemberSchema) {}
export class TenantMembershipDto extends createZodDto(tenantMembershipSchema) {}
