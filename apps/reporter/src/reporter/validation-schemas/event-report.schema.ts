import z from "zod";
import {
  eventSource,
  eventType,
  funnelStage,
} from "src/reporter/validation-schemas/general.schemas";

export const eventReportSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
  source: eventSource,
  funnelStage: funnelStage,
  eventType: eventType,
});
