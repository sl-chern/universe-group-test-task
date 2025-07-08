import { Module } from "@nestjs/common";
import { NatsService } from "src/nats/nats.service";
import { ConfigService } from "@nestjs/config";
import { TiktokModule } from "src/tiktok/tiktok.module";

@Module({
  imports: [TiktokModule],
  providers: [NatsService, ConfigService],
  exports: [NatsService],
})
export class NatsModule {}
