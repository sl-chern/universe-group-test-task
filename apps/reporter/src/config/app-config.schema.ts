import { z } from "zod";
import { nodeEnv } from "@testtask/utilities";

export const environmentVariablesSchema = z.object({
  NODE_ENV: z.enum([nodeEnv.test, nodeEnv.development, nodeEnv.production]),
  PORT: z.string(),
  GLOBAL_PREFIX: z.string(),
  BODY_LIMIT: z.string(),
  DATABASE_URL: z.string().url(),
});
