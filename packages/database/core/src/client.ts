import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "./generated/prisma/client.js";

export function createCoreClient(opts: { connectionString: string; schema?: string; poolMax?: number }) {
  const url = new URL(opts.connectionString);
  const schema = opts.schema ?? url.searchParams.get('schema') ?? 'core';
  url.searchParams.delete('schema');
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: url.toString(), max: opts.poolMax ?? 3 }, { schema }),
  });
}