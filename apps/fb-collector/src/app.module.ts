import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { NatsModule } from "src/nats/nats.module";
import appConfig from "src/config/app.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: [".env"],
    }),
    NatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
