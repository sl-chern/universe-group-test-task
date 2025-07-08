import { Controller, Get, Query } from "@nestjs/common";
import { ZodPipe } from "@testtask/utilities";
import { ReporterService } from "src/reporter/reporter.service";
import { eventReportSchema } from "src/reporter/validation-schemas/event-report.schema";
import { revenueReportSchema } from "src/reporter/validation-schemas/revenue-report.schema";
import { demographicReportSchema } from "src/reporter/validation-schemas/demographic-report.schema";
import { EventReportDto } from "src/reporter/dto/event-report.dto";
import { RevenueReportDto } from "src/reporter/dto/revenue-report.dto";
import { DemographicReportDto } from "src/reporter/dto/demographic-report.dto";

@Controller("reports")
export class ReporterController {
  constructor(private readonly reporterService: ReporterService) {}

  @Get("events")
  getEventStats(
    @Query(new ZodPipe(eventReportSchema))
    query: EventReportDto,
  ) {
    return this.reporterService.getEventStats(query);
  }

  @Get("revenue")
  getRevenueStats(
    @Query(new ZodPipe(revenueReportSchema))
    query: RevenueReportDto,
  ) {
    return this.reporterService.getRevenueStats(query);
  }

  @Get("demographics")
  getDemographics(
    @Query(new ZodPipe(demographicReportSchema))
    query: DemographicReportDto,
  ) {
    return this.reporterService.getDemographics(query);
  }
}
