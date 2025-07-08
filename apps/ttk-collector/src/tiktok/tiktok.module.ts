import { Module } from "@nestjs/common";
import { TiktokService } from "src/tiktok/tiktok.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [TiktokService],
  exports: [TiktokService],
})
export class TiktokModule {}
