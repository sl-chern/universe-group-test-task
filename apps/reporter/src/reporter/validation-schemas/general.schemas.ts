import { z } from "zod";

export const eventType = z.union([
  z.literal("ad.view"),
  z.literal("page.like"),
  z.literal("comment"),
  z.literal("video.view"),
  z.literal("ad.click"),
  z.literal("form.submission"),
  z.literal("checkout.complete"),
  z.literal("video.view"),
  z.literal("like"),
  z.literal("share"),
  z.literal("comment"),
  z.literal("profile.visit"),
  z.literal("purchase"),
  z.literal("follow"),
]);

export const eventSource = z.union([
  z.literal("facebook"),
  z.literal("tiktok"),
]);

export const funnelStage = z.union([z.literal("top"), z.literal("bottom")]);
