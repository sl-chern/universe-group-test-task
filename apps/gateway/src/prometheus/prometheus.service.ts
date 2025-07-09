import { Injectable } from "@nestjs/common";
import { Counter, Registry } from "prom-client";

@Injectable()
export class PrometheusService {
  private readonly register: Registry;

  private acceptedEvents: Counter;
  private processedEvents: Counter;
  private failedEvents: Counter;

  constructor() {
    this.register = new Registry();
    this.register.setDefaultLabels({ app: "gateway" });

    this.acceptedEvents = new Counter({
      name: "gateway_accepted_events_total",
      help: "Total accepted events by gateway",
      registers: [this.register],
    });

    this.processedEvents = new Counter({
      name: "gateway_processed_events_total",
      help: "Total successfully processed events by gateway",
      registers: [this.register],
    });

    this.failedEvents = new Counter({
      name: "gateway_failed_events_total",
      help: "Total failed events in gateway",
      registers: [this.register],
    });
  }

  incAccepted(count: number = 1) {
    this.acceptedEvents.inc(count);
  }

  incProcessed(count: number = 1) {
    this.processedEvents.inc(count);
  }

  incFailed(count: number = 1) {
    this.failedEvents.inc(count);
  }

  async getMetrics() {
    return await this.register.metrics();
  }
}
