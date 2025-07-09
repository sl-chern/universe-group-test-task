import { Injectable } from "@nestjs/common";
import { Histogram, Registry } from "prom-client";

@Injectable()
export class PrometheusService {
  private readonly register: Registry;
  private reportLatency: Histogram<string>;

  constructor() {
    this.register = new Registry();
    this.reportLatency = new Histogram({
      name: "reporter_report_latency_seconds",
      help: "Latency of reporter endpoints",
      labelNames: ["report_type"],
      registers: [this.register],
    });
  }

  startReportTimer(reportType: string): () => void {
    return this.reportLatency.startTimer({ report_type: reportType });
  }

  getMetrics(): Promise<string> {
    return this.register.metrics();
  }
}
