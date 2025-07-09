import { Module } from "@nestjs/common";
import { TiktokService } from "src/tiktok/tiktok.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrometheusModule } from "src/prometheus/prometheus.module";

@Module({
  imports: [PrismaModule, PrometheusModule],
  providers: [TiktokService],
  exports: [TiktokService],
})
export class TiktokModule {}
