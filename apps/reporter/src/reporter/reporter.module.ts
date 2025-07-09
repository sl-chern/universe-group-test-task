import { Module } from "@nestjs/common";
import { ReporterController } from "src/reporter/reporter.controller";
import { ReporterService } from "src/reporter/reporter.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrometheusModule } from "src/prometheus/prometheus.module";

@Module({
  imports: [PrismaModule, PrometheusModule],
  controllers: [ReporterController],
  providers: [ReporterService],
})
export class ReporterModule {}
