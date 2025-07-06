import { Module } from "@nestjs/common";
import { NatsService } from "src/nats/nats.service";
import { ConfigService } from "@nestjs/config";

@Module({
  providers: [NatsService, ConfigService],
  exports: [NatsService],
})
export class NatsModule {}
