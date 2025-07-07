import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import {
  AckPolicy,
  JetStreamClient,
  JetStreamManager,
  jetstreamManager,
  JsMsg,
} from "@nats-io/jetstream";
import { connect } from "@nats-io/transport-node";
import { NatsConnection } from "@nats-io/nats-core";
import { ConfigService } from "@nestjs/config";
import { eventType, streamName, subjectPrefix } from "@testtask/utilities";

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

    await this.ensureStreamExists(streamName, [`${subjectPrefix}.*`]);

    await this.jsm.consumers.add(streamName, {
      name: "events_facebook_consumer",
      ack_policy: AckPolicy.Explicit,
      filter_subjects: [`${subjectPrefix}.${eventType.facebook}`],
      durable_name: "events_facebook_consumer",
    });

    const consumer = await this.js.consumers.get(
      streamName,
      "events_facebook_consumer",
    );

    const messages = (await consumer.consume()) as AsyncIterable<JsMsg>;
    try {
      for await (const m of messages) {
        console.log(m.seq, m.json());
        m.ack();
      }
    } catch (err) {
      console.log(`consume failed: ${err}`);
    }
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
