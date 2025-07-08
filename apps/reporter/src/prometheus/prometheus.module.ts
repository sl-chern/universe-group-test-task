import { Module } from "@nestjs/common";
import { PrometheusController } from "src/prometheus/prometheus.controller";
import { PrometheusService } from "src/prometheus/prometheus.service";

@Module({
  controllers: [PrometheusController],
  providers: [PrometheusService],
})
export class PrometheusModule {}
