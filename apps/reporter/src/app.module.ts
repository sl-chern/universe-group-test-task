import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import appConfig from "src/config/app.config";
import { ReporterModule } from "src/reporter/reporter.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: [".env"],
    }),
    ReporterModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
