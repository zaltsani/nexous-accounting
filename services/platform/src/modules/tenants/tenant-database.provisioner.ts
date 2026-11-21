import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { quoteIdent, tenantDbName } from "@nexous-accounting/common";
import { Client } from "pg";

/** Creates and drops the physical tenant_<id> databases. */
@Injectable()
export class TenantDatabaseProvisioner {
  private readonly logger = new Logger(TenantDatabaseProvisioner.name);

  constructor(private readonly config: ConfigService) {}

  /** Returns true if the database was created, false if it already existed. */
  async createDatabase(tenantId: string): Promise<boolean> {
    const dbName = tenantDbName(tenantId);
    return this.withAdminClient(async (client) => {
      const found = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);
      if (found.rowCount) return false;
      // CREATE DATABASE can't be parameterized or run in a transaction; dbName is validated above.
      await client.query(`CREATE DATABASE ${quoteIdent(dbName)}`);
      this.logger.log(`Created database ${dbName}`);
      return true;
    });
  }

  /** Deleting database when already not needed */
  async dropDatabase(tenantId: string): Promise<void> {
    const dbName = tenantDbName(tenantId);
    await this.withAdminClient(async (client) => {
      await client.query(`DROP DATABASE IF EXISTS ${quoteIdent(dbName)} WITH (FORCE)`);
      this.logger.log(`Dropped database ${dbName}`);
    });
  }

  private async withAdminClient<R>(fn: (client: Client) => Promise<R>): Promise<R> {
    const client = new Client({
      connectionString: this.config.getOrThrow<string>("SYSTEM_DATABASE_URL"),
    });
    await client.connect();
    try {
      return await fn(client);
    } finally {
      await client.end();
    }
  }
}
