export const nodeEnv = {
  development: "development",
  production: "production",
  test: "test",
} as const;
export type NodeEnv = (typeof nodeEnv)[keyof typeof nodeEnv];

export const streamName = "events";
export const subjectPrefix = "event";

export const eventType = {
  facebook: "facebook",
  tiktok: "tiktok",
} as const;
export type EventType = (typeof eventType)[keyof typeof eventType];
