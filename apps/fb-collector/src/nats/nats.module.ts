import { Module } from "@nestjs/common";
import { NatsService } from "src/nats/nats.service";
import { ConfigService } from "@nestjs/config";
import { FacebookModule } from "src/facebook/facebook.module";
import { PrometheusModule } from "src/prometheus/prometheus.module";

@Module({
  imports: [FacebookModule, PrometheusModule],
  providers: [NatsService, ConfigService],
  exports: [NatsService],
})
export class NatsModule {}
