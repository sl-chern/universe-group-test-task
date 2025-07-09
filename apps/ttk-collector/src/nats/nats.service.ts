import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import {
  AckPolicy,
  Consumer,
  JetStreamClient,
  JetStreamManager,
  jetstreamManager,
  JsMsg,
} from "@nats-io/jetstream";
import { connect } from "@nats-io/transport-node";
import { NatsConnection } from "@nats-io/nats-core";
import { ConfigService } from "@nestjs/config";
import {
  eventType,
  streamName,
  subjectPrefix,
  TiktokEvent,
} from "@testtask/utilities";
import { TiktokService } from "src/tiktok/tiktok.service";
import { PrometheusService } from "src/prometheus/prometheus.service";

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  private nc: NatsConnection;
  private js: JetStreamClient;
  private jsm: JetStreamManager;

  constructor(
    private readonly configService: ConfigService,
    private readonly tiktokService: TiktokService,
    private readonly prometheusService: PrometheusService,
  ) {}

  async onModuleInit() {
    this.nc = (await connect({
      servers: this.configService.getOrThrow<string>("app.natsUrl"),
    })) as NatsConnection;
    this.jsm = await jetstreamManager(this.nc);
    this.js = this.jsm.jetstream();

    await this.ensureStreamExists(streamName, [`${subjectPrefix}.*`]);

    await this.jsm.consumers.add(streamName, {
      name: "events_tiktok_consumer",
      ack_policy: AckPolicy.Explicit,
      filter_subjects: [`${subjectPrefix}.${eventType.tiktok}`],
      durable_name: "events_tiktok_consumer",
    });

    const consumer = await this.js.consumers.get(
      streamName,
      "events_tiktok_consumer",
    );

    (async (consumer: Consumer) => {
      const messages = (await consumer.consume({
        max_messages: 1,
      })) as AsyncIterable<JsMsg>;

      let messagesAmount: number = 0;

      try {
        for await (const m of messages) {
          const events: TiktokEvent[] = m.json();
          messagesAmount = events.length;
          this.prometheusService.incProcessed(messagesAmount);
          await this.tiktokService.insertEvents(m.json());
          this.prometheusService.incAccepted(messagesAmount);
          m.ack();
        }
      } catch {
        this.prometheusService.incFailed(messagesAmount);
      }
    })(consumer);
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
