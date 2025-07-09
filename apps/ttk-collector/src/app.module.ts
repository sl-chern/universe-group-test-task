import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { NatsModule } from "src/nats/nats.module";
import appConfig from "src/config/app.config";
import { PrometheusModule } from "src/prometheus/prometheus.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: [".env"],
    }),
    PrometheusModule,
    NatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
