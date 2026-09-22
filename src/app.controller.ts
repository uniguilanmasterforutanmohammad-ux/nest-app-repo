import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service';

@ApiTags('Health & Test')
@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'بررسی سلامت سرور' })
  getHello(): string {
    return 'Bio-Link API is up and running!';
  }

  @Get('test-db')
  @ApiOperation({ summary: 'تست اتصال Prisma به MySQL و شمارش کاربران' })
  async testDb() {
    const usersCount = await this.prisma.user.count();
    return {
      status: 'success',
      message: 'Prisma is connected to Database!',
      totalUsers: usersCount,
    };
  }
}
