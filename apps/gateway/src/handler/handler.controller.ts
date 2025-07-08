import { Body, Controller, Post } from "@nestjs/common";
import { Event } from "@testtask/utilities";
import { HandlerService } from "src/handler/handler.service";

@Controller()
export class HandlerController {
  constructor(private readonly handlerService: HandlerService) {}

  @Post("events")
  async handleEvents(@Body() events: Event[]) {
    return await this.handlerService.handleEvents(events);
  }
}
