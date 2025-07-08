import { Injectable } from "@nestjs/common";
import { EventSource, Prisma } from "@testtask/database";
import { eventType, EventType, FunnelStage } from "@testtask/utilities";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ReporterService {
  constructor(private prisma: PrismaService) {}

  async getEventStats(filters: {
    from: Date;
    to: Date;
    source: string;
    funnelStage: string;
    eventType: string;
  }) {
    const where: Prisma.EventWhereInput = {
      timestamp: {
        gte: filters.from,
        lte: filters.to,
      },
      source: filters.source as EventSource,
      funnelStage: filters.funnelStage as FunnelStage,
      eventType: filters.eventType,
    };

    return this.prisma.event.groupBy({
      by: ["source", "funnelStage", "eventType"],
      where,
      _count: true,
    });
  }

  async getRevenueStats(filters: {
    from: Date;
    to: Date;
    source: EventType;
    campaignId?: string;
  }) {
    const { from, to, source, campaignId } = filters;

    const timestampFilter: Prisma.EventWhereInput = {
      timestamp: {
        gte: from,
        lte: to,
      },
    };

    if (source === "facebook") {
      const revenue = await this.prisma.facebookEngagementBottom.aggregate({
        _sum: {
          purchaseAmount: true,
        },
        where: {
          event: {
            source: "facebook",
            eventType: "checkout.complete",
            ...timestampFilter,
          },
          ...(campaignId ? { campaignId } : {}),
        },
      });

      return {
        source: "facebook",
        totalRevenue: revenue._sum.purchaseAmount || 0,
      };
    }

    if (source === "tiktok") {
      const revenue = await this.prisma.tiktokEngagementBottom.aggregate({
        _sum: {
          purchaseAmount: true,
        },
        where: {
          event: {
            source: "tiktok",
            eventType: "purchase",
            ...timestampFilter,
          },
        },
      });

      return {
        source: "tiktok",
        totalRevenue: revenue._sum.purchaseAmount || 0,
      };
    }

    return {
      source,
      totalRevenue: 0,
    };
  }

  async getDemographics(filters: { from: Date; to: Date; source: EventType }) {
    const commonWhere: Prisma.EventWhereInput = {
      timestamp: {
        gte: filters.from,
        lte: filters.to,
      },
      source: filters.source as EventSource,
    };

    if (filters.source === eventType.facebook) {
      return this.prisma.facebookUser.groupBy({
        by: ["gender", "age", "country", "city"],
        where: {
          event: { ...commonWhere },
        },
        _count: true,
      });
    }

    if (filters.source === eventType.tiktok) {
      return this.prisma.tiktokUser.groupBy({
        by: ["followers"],
        where: {
          event: { ...commonWhere },
        },
        _count: true,
      });
    }

    return [];
  }
}
