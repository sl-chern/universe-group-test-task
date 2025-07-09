import { Module } from "@nestjs/common";
import { HandlerController } from "src/handler/handler.controller";
import { HandlerService } from "src/handler/handler.service";
import { NatsModule } from "src/nats/nats.module";
import { PrometheusModule } from "src/prometheus/prometheus.module";

@Module({
  imports: [NatsModule, PrometheusModule],
  controllers: [HandlerController],
  providers: [HandlerService],
})
export class HandlerModule {}
