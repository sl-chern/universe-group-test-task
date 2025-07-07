export declare const nodeEnv: {
    readonly development: "development";
    readonly production: "production";
    readonly test: "test";
};
export type NodeEnv = (typeof nodeEnv)[keyof typeof nodeEnv];
export declare const streamName = "events";
export declare const subjectPrefix = "event";
export declare const eventType: {
    readonly facebook: "facebook";
    readonly tiktok: "tiktok";
};
export type EventType = (typeof eventType)[keyof typeof eventType];
