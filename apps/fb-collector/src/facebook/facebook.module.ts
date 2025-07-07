import { Module } from "@nestjs/common";
import { FacebookService } from "src/facebook/facebook.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [FacebookService],
  exports: [FacebookService],
})
export class FacebookModule {}
