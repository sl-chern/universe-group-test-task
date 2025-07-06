import { Injectable } from "@nestjs/common";
import { Event } from "@testtask/utilities";
import { NatsService } from "src/nats/nats.service";

@Injectable()
export class HandlerService {
  constructor(private readonly natsService: NatsService) {}

  async handleEvents(events: Event[]) {
    for (const event of events) {
      await this.natsService.publish("event.new", event);
    }
    return Promise.resolve(true);
  }
}
