import {
  EventType,
  FacebookEventType,
  FunnelStage,
  TiktokEventType,
} from "@testtask/utilities";

export interface EventReportDto {
  from: Date;
  to: Date;
  source: EventType;
  funnelStage: FunnelStage;
  eventType: FacebookEventType | TiktokEventType;
}
