import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import {
  AckPolicy,
  JetStreamClient,
  JetStreamManager,
  jetstreamManager,
  JsMsg,
  Consumer,
} from "@nats-io/jetstream";
import { connect } from "@nats-io/transport-node";
import { NatsConnection } from "@nats-io/nats-core";
import { ConfigService } from "@nestjs/config";
import {
  eventType,
  FacebookEvent,
  streamName,
  subjectPrefix,
} from "@testtask/utilities";
import { FacebookService } from "src/facebook/facebook.service";
import { PrometheusService } from "src/prometheus/prometheus.service";

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  private nc: NatsConnection;
  private js: JetStreamClient;
  private jsm: JetStreamManager;

  constructor(
    private readonly configService: ConfigService,
    private readonly facebookService: FacebookService,
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
      name: "events_facebook_consumer",
      ack_policy: AckPolicy.Explicit,
      filter_subjects: [`${subjectPrefix}.${eventType.facebook}`],
      durable_name: "events_facebook_consumer",
    });

    const consumer = await this.js.consumers.get(
      streamName,
      "events_facebook_consumer",
    );

    (async (consumer: Consumer) => {
      const messages = (await consumer.consume({
        max_messages: 1,
      })) as AsyncIterable<JsMsg>;

      let messagesAmount: number = 0;

      try {
        for await (const m of messages) {
          const events: FacebookEvent[] = m.json();
          messagesAmount = events.length;
          this.prometheusService.incProcessed(messagesAmount);
          await this.facebookService.insertEvents(events);
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
