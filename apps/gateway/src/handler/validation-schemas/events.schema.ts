import { z } from "zod";

const funnelStageSchema = z.union([z.literal("top"), z.literal("bottom")]);

const facebookTopEventType = z.union([
  z.literal("ad.view"),
  z.literal("page.like"),
  z.literal("comment"),
  z.literal("video.view"),
]);

const facebookBottomEventType = z.union([
  z.literal("ad.click"),
  z.literal("form.submission"),
  z.literal("checkout.complete"),
]);

const facebookEventType = z.union([
  facebookTopEventType,
  facebookBottomEventType,
]);

const facebookUserLocationSchema = z.object({
  country: z.string(),
  city: z.string(),
});

const facebookUserSchema = z.object({
  userId: z.string(),
  name: z.string(),
  age: z.number(),
  gender: z.union([
    z.literal("male"),
    z.literal("female"),
    z.literal("non-binary"),
  ]),
  location: facebookUserLocationSchema,
});

const facebookEngagementTopSchema = z.object({
  actionTime: z.string(),
  referrer: z.union([
    z.literal("newsfeed"),
    z.literal("marketplace"),
    z.literal("groups"),
  ]),
  videoId: z.string().nullable(),
});

const facebookEngagementBottomSchema = z.object({
  adId: z.string(),
  campaignId: z.string(),
  clickPosition: z.union([
    z.literal("top_left"),
    z.literal("bottom_right"),
    z.literal("center"),
  ]),
  device: z.union([z.literal("mobile"), z.literal("desktop")]),
  browser: z.union([
    z.literal("Chrome"),
    z.literal("Firefox"),
    z.literal("Safari"),
  ]),
  purchaseAmount: z.string().nullable(),
});

const facebookEngagementSchema = z.union([
  facebookEngagementTopSchema,
  facebookEngagementBottomSchema,
]);

const facebookEventSchema = z.object({
  eventId: z.string(),
  timestamp: z.string(),
  source: z.literal("facebook"),
  funnelStage: funnelStageSchema,
  eventType: facebookEventType,
  data: z.object({
    user: facebookUserSchema,
    engagement: facebookEngagementSchema,
  }),
});

const tiktokTopEventType = z.union([
  z.literal("video.view"),
  z.literal("like"),
  z.literal("share"),
  z.literal("comment"),
]);

const tiktokBottomEventType = z.union([
  z.literal("profile.visit"),
  z.literal("purchase"),
  z.literal("follow"),
]);

const tiktokEventType = z.union([tiktokTopEventType, tiktokBottomEventType]);

const tiktokUserSchema = z.object({
  userId: z.string(),
  username: z.string(),
  followers: z.number(),
});

const tiktokEngagementTopSchema = z.object({
  watchTime: z.number(),
  percentageWatched: z.number(),
  device: z.union([
    z.literal("Android"),
    z.literal("iOS"),
    z.literal("Desktop"),
  ]),
  country: z.string(),
  videoId: z.string(),
});

const tiktokEngagementBottomSchema = z.object({
  actionTime: z.string(),
  profileId: z.string().nullable(),
  purchasedItem: z.string().nullable(),
  purchaseAmount: z.string().nullable(),
});

const tiktokEngagementSchema = z.union([
  tiktokEngagementTopSchema,
  tiktokEngagementBottomSchema,
]);

const tiktokEventSchema = z.object({
  eventId: z.string(),
  timestamp: z.string(),
  source: z.literal("tiktok"),
  funnelStage: funnelStageSchema,
  eventType: tiktokEventType,
  data: z.object({
    user: tiktokUserSchema,
    engagement: tiktokEngagementSchema,
  }),
});

export const eventSchema = z.union([facebookEventSchema, tiktokEventSchema]);

export const eventArraySchema = z.array(eventSchema);
