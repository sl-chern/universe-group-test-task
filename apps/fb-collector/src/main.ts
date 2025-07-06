import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as bodyParser from "body-parser";
import { VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AllConfigType } from "./config/config.type";
import { ZodFilter } from "@testtask/utilities";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ZodFilter());

  const configService = app.get(ConfigService<AllConfigType>);

  app.setGlobalPrefix(
    configService.getOrThrow("app.globalPrefix", { infer: true }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  app.use(
    bodyParser.json({
      limit: configService.getOrThrow("app.bodyLimit", { infer: true }),
    }),
  );
  app.use(
    bodyParser.urlencoded({
      limit: configService.getOrThrow("app.bodyLimit", { infer: true }),
      extended: true,
    }),
  );

  await app.listen(configService.getOrThrow("app.port", { infer: true }));
}
bootstrap();
