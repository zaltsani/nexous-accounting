import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AddTenantMemberDto, CreateTenantDto } from "@nexous-accounting/common";
import { PLATFORM_PATTERNS } from "@nexous-accounting/types";
import { TenantsService } from "./tenants.service";

@Controller()
export class TenantsController {
  constructor(private readonly tenants: TenantsService) {}

  @MessagePattern(PLATFORM_PATTERNS.tenants.create)
  create(@Payload() payload: CreateTenantDto, @Payload("userId") userId: string) {
    return this.tenants.create(payload, userId);
  }

  @MessagePattern(PLATFORM_PATTERNS.tenants.get)
  get(@Payload("id") id: string) {
    return this.tenants.getById(id);
  }

  @MessagePattern(PLATFORM_PATTERNS.tenants.listForUser)
  listForUser(@Payload("userId") userId: string) {
    return this.tenants.listForUser(userId);
  }

  @MessagePattern(PLATFORM_PATTERNS.tenants.addMember)
  addMember(@Payload() payload: AddTenantMemberDto) {
    return this.tenants.addMember(payload);
  }
}
