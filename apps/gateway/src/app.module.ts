import { Module } from "@nestjs/common";
import { HandlerModule } from "src/handler/handler.module";
import { NatsModule } from "src/nats/nats.module";
import { ConfigModule } from "@nestjs/config";
import appConfig from "src/config/app.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: [".env"],
    }),
    HandlerModule,
    NatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
