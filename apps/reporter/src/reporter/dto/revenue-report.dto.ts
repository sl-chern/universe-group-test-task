import { EventType } from "@testtask/utilities";

export interface RevenueReportDto {
  from: Date;
  to: Date;
  source: EventType;
  campaignId?: string;
}
