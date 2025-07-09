import { z } from "zod";
import { eventSource } from "src/reporter/validation-schemas/general.schemas";

export const demographicReportSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
  source: eventSource,
});
