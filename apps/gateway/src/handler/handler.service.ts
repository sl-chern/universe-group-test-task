import { Injectable } from "@nestjs/common";
import { Event } from "@testtask/types";

@Injectable()
export class HandlerService {
  async handleEvents(events: Event[]) {
    console.log(events);
    return Promise.resolve(true);
  }
}
