import { Injectable } from "@nestjs/common";
import { Event, eventType, subjectPrefix } from "@testtask/utilities";
import { NatsService } from "src/nats/nats.service";
import { eventSchema } from "src/handler/validation-schemas/events.schema";
import { PrometheusService } from "src/prometheus/prometheus.service";

@Injectable()
export class HandlerService {
  constructor(
    private readonly natsService: NatsService,
    private readonly prometheusService: PrometheusService,
  ) {}

  async bulkEventPublish(
    events: Event[],
    subject: string,
    chunkSize: number = 1000,
  ) {
    for (let i = 0; i < events.length; i += chunkSize) {
      const chunk = events.slice(i, i + chunkSize);
      await this.natsService.publish(subject, chunk);
    }
  }

  async handleEvents(events: Event[]) {
    const validEvents: Event[] = [];
    let invalidCount = 0;

    for (const event of events) {
      const result = eventSchema.safeParse(event);
      if (result.success) {
        validEvents.push(event);
      } else {
        invalidCount++;
      }
    }

    this.prometheusService.incFailed(invalidCount);
    this.prometheusService.incAccepted(events.length - invalidCount);
    this.prometheusService.incProcessed(events.length);

    const facebookEvents = validEvents.filter(
      (event) => event.source === eventType.facebook,
    );
    const tiktokEvents = validEvents.filter(
      (event) => event.source === eventType.tiktok,
    );

    await Promise.allSettled([
      this.bulkEventPublish(
        facebookEvents,
        `${subjectPrefix}.${eventType.facebook}`,
      ),
      this.bulkEventPublish(
        tiktokEvents,
        `${subjectPrefix}.${eventType.tiktok}`,
      ),
    ]);

    return Promise.resolve(true);
  }
}
