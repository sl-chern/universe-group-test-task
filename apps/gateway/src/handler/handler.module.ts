import { Module } from "@nestjs/common";
import { HandlerController } from "src/handler/handler.controller";
import { HandlerService } from "src/handler/handler.service";
import { NatsModule } from "src/nats/nats.module";

@Module({
  imports: [NatsModule],
  controllers: [HandlerController],
  providers: [HandlerService],
})
export class HandlerModule {}
