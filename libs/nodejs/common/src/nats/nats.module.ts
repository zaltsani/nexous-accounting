import { Global, Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: "CORE_ACCOUNTING_SERVICE",
        transport: Transport.NATS,
        options: {
          servers: ["nats://localhost:4222"],
        },
      },
      {
        name: "POS_SERVICE",
        transport: Transport.NATS,
        options: {
          servers: ["nats://localhost:4222"],
        },
      },
    ]),
  ],
  exports: [
    ClientsModule.register([
      {
        name: "CORE_ACCOUNTING_SERVICE",
        transport: Transport.NATS,
        options: {
          servers: ["nats://localhost:4222"],
        },
      },
      {
        name: "POS_SERVICE",
        transport: Transport.NATS,
        options: {
          servers: ["nats://localhost:4222"],
        },
      },
    ]),
  ],
})
export class NatsClientModule {}
