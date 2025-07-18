import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { TerminusModule } from "@nestjs/terminus";
import { PrismaModule } from "src/prisma/prisma.module";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [TerminusModule, PrismaModule, HttpModule],
  controllers: [HealthController],
})
export class HealthModule {}
