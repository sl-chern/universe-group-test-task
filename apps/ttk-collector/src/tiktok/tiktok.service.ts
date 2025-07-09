import { Injectable } from "@nestjs/common";
import {
  Event,
  TiktokEngagementBottom as DbTiktokEngagementBottom,
  TiktokEngagementTop as DbTiktokEngagementTop,
  TiktokUser,
  Prisma,
} from "@testtask/database";
import {
  TiktokEngagementBottom,
  TiktokEngagementTop,
  TiktokEvent,
} from "@testtask/utilities";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TiktokService {
  constructor(private readonly prisma: PrismaService) {}

  async insertEvents(events: TiktokEvent[]) {
    const dbEvents: Event[] = [];
    const tiktokUsers: TiktokUser[] = [];
    const tiktokTopEngagements: DbTiktokEngagementTop[] = [];
    const tiktokBottomEngagements: DbTiktokEngagementBottom[] = [];

    for (const event of events) {
      dbEvents.push({
        id: event.eventId,
        timestamp: new Date(event.timestamp),
        source: event.source,
        funnelStage: event.funnelStage,
        eventType: event.eventType,
      });
      tiktokUsers.push({
        eventId: event.eventId,
        username: event.data.user.username,
        followers: event.data.user.followers,
      });
      if (event.funnelStage === "top") {
        const tiktokTopEngagement = event.data
          .engagement as TiktokEngagementTop;
        tiktokTopEngagements.push({
          eventId: event.eventId,
          videoId: tiktokTopEngagement.videoId,
          watchTime: tiktokTopEngagement.watchTime,
          percentageWatched: tiktokTopEngagement.percentageWatched,
          device: tiktokTopEngagement.device,
          country: tiktokTopEngagement.country,
        });
      }
      if (event.funnelStage === "bottom") {
        const tiktokBottomEngagement = event.data
          .engagement as TiktokEngagementBottom;
        tiktokBottomEngagements.push({
          eventId: event.eventId,
          actionTime: new Date(tiktokBottomEngagement.actionTime),
          profileId: tiktokBottomEngagement.profileId,
          purchasedItem: tiktokBottomEngagement.purchasedItem,
          purchaseAmount: isNaN(
            parseFloat(tiktokBottomEngagement.purchaseAmount),
          )
            ? null
            : new Prisma.Decimal(tiktokBottomEngagement.purchaseAmount),
        });
      }
    }
    await this.prisma.event.createMany({
      data: dbEvents,
    });
    await Promise.allSettled([
      await this.prisma.tiktokUser.createMany({
        data: tiktokUsers,
      }),
      await this.prisma.tiktokEngagementTop.createMany({
        data: tiktokTopEngagements,
      }),
      await this.prisma.tiktokEngagementBottom.createMany({
        data: tiktokBottomEngagements,
      }),
    ]);
  }
}
