import { Injectable } from "@nestjs/common";
import { Event } from "@testtask/database";
import { FacebookEvent } from "@testtask/utilities";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FacebookService {
  constructor(private readonly prisma: PrismaService) {}

  async insertEvents(events: FacebookEvent[]) {
    const event: Event = {
      id: events[0].eventId,
      timestamp: new Date(events[0].timestamp),
      source: events[0].source,
      funnelStage: events[0].funnelStage,
      eventType: events[0].eventType,
    };
    await this.prisma.event.createMany({});
  }
}
