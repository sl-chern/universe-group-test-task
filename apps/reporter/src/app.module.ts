import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import appConfig from "src/config/app.config";
import { ReporterModule } from "src/reporter/reporter.module";
import { PrometheusModule } from "src/prometheus/prometheus.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: [`${process.env.NODE_ENV ? "prod" : ""}.env`],
    }),
    ReporterModule,
    PrometheusModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
