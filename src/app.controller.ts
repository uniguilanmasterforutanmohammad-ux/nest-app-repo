import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-db')
  async testDb() {
    // یک کوئری خام برای سنجش سلامت اتصال به MySQL
    const result = await this.prisma.$queryRaw`SELECT 1 as is_connected`;
    return { status: 'ok', result };
  }
}
