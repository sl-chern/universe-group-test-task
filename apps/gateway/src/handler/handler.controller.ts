import { Body, Controller, Post } from "@nestjs/common";
import { Event, ZodPipe } from "@testtask/utilities";
import { HandlerService } from "src/handler/handler.service";
import { eventArraySchema } from "src/handler/validation-schemas/events.schema";

@Controller()
export class HandlerController {
  constructor(private readonly handlerService: HandlerService) {}

  @Post("events")
  async handleEvents(@Body(new ZodPipe(eventArraySchema)) events: Event[]) {
    return await this.handlerService.handleEvents(events);
  }
}
