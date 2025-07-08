import { Injectable } from "@nestjs/common";
import {
  Event,
  FacebookEngagementBottom as DbFacebookEngagementBottom,
  FacebookEngagementTop as DbFacebookEngagementTop,
  FacebookUser,
  Gender,
  Prisma,
} from "@testtask/database";
import {
  FacebookEngagementBottom,
  FacebookEngagementTop,
  FacebookEvent,
} from "@testtask/utilities";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FacebookService {
  constructor(private readonly prisma: PrismaService) {}

  async insertEvents(events: FacebookEvent[]) {
    const dbEvents: Event[] = [];
    const facebookUsers: FacebookUser[] = [];
    const facebookTopEngagements: DbFacebookEngagementTop[] = [];
    const facebookBottomEngagements: DbFacebookEngagementBottom[] = [];

    for (const event of events) {
      dbEvents.push({
        id: event.eventId,
        timestamp: new Date(event.timestamp),
        source: event.source,
        funnelStage: event.funnelStage,
        eventType: event.eventType,
      });
      facebookUsers.push({
        eventId: event.eventId,
        name: event.data.user.name,
        age: event.data.user.age,
        gender: event.data.user.gender.replace("-", "_") as Gender,
        country: event.data.user.location.country,
        city: event.data.user.location.city,
      });
      if (event.funnelStage === "top") {
        const facebookTopEngagement = event.data
          .engagement as FacebookEngagementTop;
        facebookTopEngagements.push({
          eventId: event.eventId,
          actionTime: new Date(facebookTopEngagement.actionTime),
          referrer: facebookTopEngagement.referrer,
          videoId: facebookTopEngagement.videoId,
        });
      }
      if (event.funnelStage === "bottom") {
        const facebookBottomEngagement = event.data
          .engagement as FacebookEngagementBottom;
        facebookBottomEngagements.push({
          eventId: event.eventId,
          adId: facebookBottomEngagement.adId,
          campaignId: facebookBottomEngagement.campaignId,
          clickPosition: facebookBottomEngagement.clickPosition,
          device: facebookBottomEngagement.device,
          browser: facebookBottomEngagement.browser,
          purchaseAmount: isNaN(
            parseFloat(facebookBottomEngagement.purchaseAmount),
          )
            ? null
            : new Prisma.Decimal(facebookBottomEngagement.purchaseAmount),
        });
      }
    }
    await Promise.allSettled([
      await this.prisma.event.createMany({
        data: dbEvents,
      }),
      await this.prisma.facebookUser.createMany({
        data: facebookUsers,
      }),
      await this.prisma.facebookEngagementTop.createMany({
        data: facebookTopEngagements,
      }),
      await this.prisma.facebookEngagementBottom.createMany({
        data: facebookBottomEngagements,
      }),
    ]);
  }
}
