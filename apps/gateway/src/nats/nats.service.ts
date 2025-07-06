import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import {
  JetStreamClient,
  JetStreamManager,
  jetstreamManager,
} from "@nats-io/jetstream";
import { connect } from "@nats-io/transport-node";
import { NatsConnection } from "@nats-io/nats-core";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  private nc: NatsConnection;
  private js: JetStreamClient;
  private jsm: JetStreamManager;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.nc = (await connect({
      servers: this.configService.getOrThrow<string>("app.natsUrl"),
    })) as NatsConnection;
    this.jsm = await jetstreamManager(this.nc);
    this.js = this.jsm.jetstream();

    await this.ensureStreamExists("events", ["event.*"]);
  }

  async publish<T>(subject: string, data: T): Promise<void> {
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    await this.js.publish(subject, encoded);
  }

  async onModuleDestroy() {
    await this.nc.close();
  }

  private async ensureStreamExists(streamName: string, subjects: string[]) {
    try {
      await this.jsm.streams.info(streamName);
    } catch {
      await this.jsm.streams.add({
        name: streamName,
        subjects: subjects,
      });
    }
  }
}
