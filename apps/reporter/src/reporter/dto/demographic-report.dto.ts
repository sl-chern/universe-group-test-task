import { EventType } from "@testtask/utilities";

export interface DemographicReportDto {
  from: Date;
  to: Date;
  source: EventType;
}
