import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@nexous-accounting/database-core";
import { PrismaPg } from "@prisma/adapter-pg";

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg(
      { connectionString: process.env.DATABASE_URL as string },
      { schema: "core" },
    );
    super({ adapter });
  }
}
