import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { TenantDto, TenantMembershipDto } from "@nexous-accounting/common";
import { PrismaService } from "../../database/prisma.service";
import { TenantDatabaseProvisioner } from "./tenant-database.provisioner";
import { IAddTenantMember, ICreateTenant, ITenantRole } from "@nexous-accounting/types";
import { TenantMigrator } from "./tenant-migrator.service";

interface TenantRow {
  id: string;
  slug: string;
  name: string;
  isActive: boolean;
}

function toDto(tenant: TenantRow): TenantDto {
  return { ...tenant };
}

@Injectable()
export class TenantsService {
  private readonly logger = new Logger(TenantsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly provisioner: TenantDatabaseProvisioner,
    private readonly migrator: TenantMigrator,
  ) {}

  /**
   * 1. insert tenant (inactive) + owner membership
   * 2. create database tenant_<id>
   * 3. provision service schemas (hook, not implemented yet)
   * 4. mark tenant active
   * If 2-4 fail, the database (if we created it) and the rows are removed again.
   */
  async create(dto: ICreateTenant, userId: string): Promise<TenantDto> {
    const ownerUserId = dto.ownerUserId ?? userId; 
    const owner = await this.prisma.user.findUnique({ where: { id: ownerUserId } });
    if (!owner) throw new NotFoundException("Owner user not found");
    if (!owner.isActive) throw new BadRequestException("Owner user is not active");

    const slugTaken = await this.prisma.tenant.findUnique({
      where: { slug: dto.slug },
      select: { id: true },
    });
    if (slugTaken) throw new ConflictException("Tenant slug is already taken");

    const tenant = await this.prisma.tenant.create({
      data: {
        slug: dto.slug,
        name: dto.name,
        isActive: false,
        members: { create: { userId: owner.id, role: "OWNER" } },
      },
    });

    let databaseCreated = false;
    try {
      databaseCreated = await this.provisioner.createDatabase(tenant.id);
      await this.provisionServiceSchemas(tenant.id);
      const active = await this.prisma.tenant.update({
        where: { id: tenant.id },
        data: { isActive: true },
      });
      return toDto(active);
    } catch (error) {
      this.logger.error(`Provisioning tenant ${tenant.id} failed`, error as Error);
      await this.rollback(tenant.id, databaseCreated);
      throw error;
    }
  }

  async getById(id: string): Promise<TenantDto> {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) throw new NotFoundException("Tenant not found");
    return toDto(tenant);
  }

  async listForUser(userId: string): Promise<TenantMembershipDto[]> {
    const memberships = await this.prisma.tenantMember.findMany({
      where: { userId },
      include: { tenant: true },
      orderBy: { createdAt: "asc" },
    });
    return memberships.map((m) => ({ tenant: toDto(m.tenant), role: m.role as ITenantRole }));
  }

  async addMember(data: IAddTenantMember): Promise<{ tenantId: string; userId: string; role: string }> {
    const [tenant, user] = await Promise.all([
      this.prisma.tenant.findUnique({ where: { id: data.tenantId }, select: { id: true } }),
      this.prisma.user.findUnique({ where: { id: data.userId }, select: { id: true } }),
    ]);
    if (!tenant) throw new NotFoundException("Tenant not found");
    if (!user) throw new NotFoundException("User not found");

    const existing = await this.prisma.tenantMember.findUnique({
      where: { tenantId_userId: { tenantId: data.tenantId, userId: data.userId } },
      select: { id: true },
    });
    if (existing) throw new ConflictException("User is already a member of this tenant");

    const member = await this.prisma.tenantMember.create({ data });
    return { tenantId: member.tenantId, userId: member.userId, role: member.role };
  }

  /**
   * Extension point: ask every application service (core, finops, ...) to create its
   * schema and run its migrations/seeds inside tenant_<id>. Intentionally empty for now.
   */
  private async provisionServiceSchemas(tenantId: string): Promise<void> {
    await this.migrator.migrateTenant(tenantId, { seed: true });
  }

  private async rollback(tenantId: string, databaseCreated: boolean): Promise<void> {
    try {
      if (databaseCreated) await this.provisioner.dropDatabase(tenantId);
      await this.prisma.tenantMember.deleteMany({ where: { tenantId } });
      await this.prisma.tenant.delete({ where: { id: tenantId } });
    } catch (cleanupError) {
      this.logger.error(`Rollback of tenant ${tenantId} failed`, cleanupError as Error);
    }
  }
}
