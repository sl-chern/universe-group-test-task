import { Controller, Get, Query } from "@nestjs/common";
import { ZodPipe } from "@testtask/utilities";
import { ReporterService } from "src/reporter/reporter.service";
import { eventReportSchema } from "src/reporter/validation-schemas/event-report.schema";
import { revenueReportSchema } from "src/reporter/validation-schemas/revenue-report.schema";
import { demographicReportSchema } from "src/reporter/validation-schemas/demographic-report.schema";
import { EventReportDto } from "src/reporter/dto/event-report.dto";
import { RevenueReportDto } from "src/reporter/dto/revenue-report.dto";
import { DemographicReportDto } from "src/reporter/dto/demographic-report.dto";
import { PrometheusService } from "src/prometheus/prometheus.service";

@Controller("reports")
export class ReporterController {
  constructor(
    private readonly reporterService: ReporterService,
    private readonly prometheusService: PrometheusService,
  ) {}

  @Get("events")
  getEventStats(
    @Query(new ZodPipe(eventReportSchema))
    query: EventReportDto,
  ) {
    const stop = this.prometheusService.startReportTimer("events");
    try {
      return this.reporterService.getEventStats(query);
    } finally {
      stop();
    }
  }

  @Get("revenue")
  getRevenueStats(
    @Query(new ZodPipe(revenueReportSchema))
    query: RevenueReportDto,
  ) {
    const stop = this.prometheusService.startReportTimer("revenue");
    try {
      return this.reporterService.getRevenueStats(query);
    } finally {
      stop();
    }
  }

  @Get("demographics")
  getDemographics(
    @Query(new ZodPipe(demographicReportSchema))
    query: DemographicReportDto,
  ) {
    const stop = this.prometheusService.startReportTimer("demographics");
    try {
      return this.reporterService.getDemographics(query);
    } finally {
      stop();
    }
  }
}
