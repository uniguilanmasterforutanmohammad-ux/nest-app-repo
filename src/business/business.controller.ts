import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@ApiTags('Businesses')
@Controller('businesses')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @ApiOperation({ summary: 'ایجاد بیزینس جدید (بر اساس محدودیت پلن)' })
  @ApiHeader({ name: 'x-user-id', required: true, description: 'آیدی کاربر (تستی تا زمان اتصال کامل گارد)' })
  create(
    @Headers('x-user-id') userId: string,
    @Body() createBusinessDto: CreateBusinessDto,
  ) {
    if (!userId) {
      throw new BadRequestException('ارسال هدر x-user-id الزامی است');
    }
    return this.businessService.create(userId, createBusinessDto);
  }

  @Get()
  @ApiOperation({ summary: 'نمایش کل بیزینس‌ها (صفحه عمومی لیست بیزینس‌ها)' })
  findAll() {
    return this.businessService.findAll();
  }

  @Get('my-businesses')
  @ApiOperation({ summary: 'نمایش بیزینس‌های کاربر جاری' })
  @ApiHeader({ name: 'x-user-id', required: true })
  findAllByUser(@Headers('x-user-id') userId: string) {
    if (!userId) {
      throw new BadRequestException('ارسال هدر x-user-id الزامی است');
    }
    return this.businessService.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'دریافت مشخصات صفحه اختصاصی یک بیزینس' })
  findOne(@Param('id') id: string) {
    return this.businessService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'ویرایش بیزینس' })
  @ApiHeader({ name: 'x-user-id', required: true })
  update(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    if (!userId) {
      throw new BadRequestException('ارسال هدر x-user-id الزامی است');
    }
    return this.businessService.update(id, userId, updateBusinessDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف بیزینس' })
  @ApiHeader({ name: 'x-user-id', required: true })
  remove(@Param('id') id: string, @Headers('x-user-id') userId: string) {
    if (!userId) {
      throw new BadRequestException('ارسال هدر x-user-id الزامی است');
    }
    return this.businessService.remove(id, userId);
  }
}
