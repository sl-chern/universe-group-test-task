import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { jetstream, JetStreamClient } from "@nats-io/jetstream";
import { connect } from "@nats-io/transport-node";
import { NatsConnection } from "@nats-io/nats-core";

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  private nc: NatsConnection;
  private js: JetStreamClient;

  async onModuleInit() {
    this.nc = (await connect({ servers: "demo.nats.io" })) as NatsConnection;
    this.js = jetstream(this.nc);
  }

  async publish<T>(subject: string, data: T): Promise<void> {
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    await this.js.publish(subject, { payload: encoded });
  }

  async onModuleDestroy() {
    await this.nc.close();
  }
}
