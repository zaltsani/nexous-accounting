import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { UserDto } from "@nexous-accounting/common";
import { ICreateUser } from "@nexous-accounting/types";
import { PrismaService } from "../../database/prisma.service";
import { hashPassword } from "./password.util";

export const USER_SELECT = {
  id: true,
  email: true,
  name: true,
  isActive: true,
  createdAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ICreateUser): Promise<UserDto> {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });
    if (existing) throw new ConflictException("Email is already registered");

    return this.prisma.user.create({
      data: { email: data.email, name: data.name, password: await hashPassword(data.password) },
      select: USER_SELECT,
    });
  }

  async getById(id: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({ where: { id }, select: USER_SELECT });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }
}
