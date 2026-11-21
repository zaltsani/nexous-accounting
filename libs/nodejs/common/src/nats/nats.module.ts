import { Global, Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { tenantAwareNatsClient } from "../tenant/tenant-aware-client.js";

@Global()
@Module({
  imports: [
    ClientsModule.register([
      tenantAwareNatsClient("NATS_SERVICE", [process.env.NATS_URL || "nats://localhost:4222"]),
    ]),
  ],
  exports: [
    ClientsModule.register([
      tenantAwareNatsClient("NATS_SERVICE", [process.env.NATS_URL || "nats://localhost:4222"]),
    ]),
  ],
})
export class NatsClientModule {}
