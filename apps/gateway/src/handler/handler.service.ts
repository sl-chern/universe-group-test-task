import { Injectable } from "@nestjs/common";
import { Event, eventType, subjectPrefix } from "@testtask/utilities";
import { NatsService } from "src/nats/nats.service";

@Injectable()
export class HandlerService {
  constructor(private readonly natsService: NatsService) {}

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
    const facebookEvents = events.filter(
      (event) => event.source === eventType.facebook,
    );
    const tiktokEvents = events.filter(
      (event) => event.source === eventType.tiktok,
    );

    console.log(JSON.stringify(facebookEvents[0]));
    console.log(JSON.stringify(facebookEvents[1]));
    console.log(JSON.stringify(tiktokEvents[0]));
    console.log(JSON.stringify(tiktokEvents[1]));

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
