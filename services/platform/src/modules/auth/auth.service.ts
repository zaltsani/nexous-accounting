import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import {
  IAccessTokenPayload,
  IAuthToken,
  ILogin,
  ILoginResult,
  IRefresh,
  ISelectTenantResponse,
  ITenant,
  ITenantMembership,
  ITenantRole,
} from "@nexous-accounting/types";
import { PrismaService } from "../../database/prisma.service";
import { hashPassword, verifyPassword } from "../users/password.util";
import { USER_SELECT } from "../users/users.service";

const ACCESS_TTL_SECONDS = 15 * 60;
const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60;

interface MembershipRow {
  tenantId: string;
  role: string;
  tenant: ITenant;
}

function toMembershipDto(m: MembershipRow): ITenantMembership {
  return {
    ...m,
    role: m.role as ITenantRole,
  };
}

@Injectable()
export class AuthService {
  private dummyHash?: Promise<string>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(data: ILogin): Promise<ILoginResult> {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
    const hash = user?.password ?? (await (this.dummyHash ??= hashPassword("not-a-real-password")));
    const passwordOk = await verifyPassword(data.password, hash);
    if (!user || !user.isActive || !passwordOk) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const memberships = await this.activeMemberships(user.id);

    let selected: MembershipRow | null = null;
    if (data.tenantId) {
      selected = memberships.find((m) => m.tenantId === data.tenantId) ?? null;
      if (!selected) throw new ForbiddenException("No access to this tenant");
    } else if (memberships.length === 1) {
      selected = memberships[0];
    }

    return {
      user: await this.userDto(user.id),
      tenants: memberships.map(toMembershipDto),
      tenant: selected?.tenant ?? null,
      tokens: await this.issueTokens(user.id, selected),
    };
  }

  async selectTenant(tenantId: string, userId: string): Promise<ISelectTenantResponse> {
    await this.assertActiveUser(userId);

    const membership = (await this.activeMemberships(userId)).find((m) => m.tenantId === tenantId);
    if (!membership) throw new ForbiddenException("No access to this tenant");
    const authToken = await this.issueTokens(userId, membership);

    return {
      membership: toMembershipDto(membership),
      authToken,
    };
  }

  async refresh(data: IRefresh): Promise<IAuthToken> {
    const { refreshToken } = data;

    let payload: IAccessTokenPayload;
    try {
      payload = await this.jwt.verifyAsync<IAccessTokenPayload>(refreshToken, {
        secret: this.config.getOrThrow<string>("JWT_REFRESH_TOKEN_SECRET"),
      });
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    await this.assertActiveUser(payload.sub);

    let membership: MembershipRow | null = null;
    if (payload.tid) {
      membership =
        (await this.activeMemberships(payload.sub)).find((m) => m.tenantId === payload.tid) ?? null;
      if (!membership) throw new UnauthorizedException("Tenant access was revoked");
    }
    return this.issueTokens(payload.sub, membership);
  }

  private activeMemberships(userId: string): Promise<MembershipRow[]> {
    return this.prisma.tenantMember.findMany({
      where: { userId, tenant: { isActive: true } },
      include: { tenant: true },
      orderBy: { createdAt: "asc" },
    });
  }

  private async assertActiveUser(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isActive: true },
    });
    if (!user?.isActive) throw new UnauthorizedException("User is not active");
  }

  private userDto(id: string) {
    return this.prisma.user.findUniqueOrThrow({ where: { id }, select: USER_SELECT });
  }

  private async issueTokens(userId: string, membership: MembershipRow | null): Promise<IAuthToken> {
    const access: IAccessTokenPayload = { sub: userId };
    if (membership) {
      access.tid = membership.tenantId;
      access.role = membership.role;
    }
    const refresh: IAccessTokenPayload = {
      sub: userId,
      ...(membership ? { tid: membership.tenantId } : {}),
    };

    const accessTtl = Number(this.config.get("JWT_ACCESS_TOKEN_EXPIRATION", ACCESS_TTL_SECONDS));
    const refreshTtl = Number(this.config.get("JWT_REFRESH_TOKEN_EXPIRATION", REFRESH_TTL_SECONDS));

    return {
      accessToken: await this.jwt.signAsync(access, {
        secret: this.config.getOrThrow<string>("JWT_ACCESS_TOKEN_SECRET"),
        expiresIn: accessTtl,
      }),
      refreshToken: await this.jwt.signAsync(refresh, {
        secret: this.config.getOrThrow<string>("JWT_REFRESH_TOKEN_SECRET"),
        expiresIn: refreshTtl,
      }),
      expiresIn: accessTtl,
    };
  }
}
