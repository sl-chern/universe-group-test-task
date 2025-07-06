export declare const nodeEnv: {
    readonly development: "development";
    readonly production: "production";
    readonly test: "test";
};
export type NodeEnv = (typeof nodeEnv)[keyof typeof nodeEnv];
