import z from "zod";
import { eventSource } from "src/reporter/validation-schemas/general.schemas";

export const revenueReportSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
  source: eventSource,
  campaignId: z.string().optional(),
});
