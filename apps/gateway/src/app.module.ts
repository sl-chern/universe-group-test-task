import { Module } from "@nestjs/common";
import { HandlerModule } from "./handler/handler.module";
import { NatsModule } from "./nats/nats.module";

@Module({
  imports: [HandlerModule, NatsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
