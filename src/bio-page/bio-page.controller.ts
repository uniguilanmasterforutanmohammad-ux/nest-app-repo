import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { Request } from 'express';
import { BioPageService } from './bio-page.service';
import { CreateBioPageDto } from './dto/create-bio-page.dto';
import { UpdateBioPageDto } from './dto/update-bio-page.dto';

@ApiTags('Bio Pages')
@Controller('bio-pages')
export class BioPageController {
  constructor(private readonly bioPageService: BioPageService) {}

  @Post()
  @ApiOperation({ summary: 'ایجاد صفحه بیولینک جدید برای یک بیزینس' })
  @ApiHeader({ name: 'x-user-id', required: true })
  create(
    @Headers('x-user-id') userId: string,
    @Body() createBioPageDto: CreateBioPageDto,
  ) {
    if (!userId) throw new BadRequestException('هدر x-user-id الزامی است');
    return this.bioPageService.create(userId, createBioPageDto);
  }

  @Get()
  @ApiOperation({ summary: 'لیست کل بیولینک‌ها (صفحه عمومی)' })
  findAll() {
    return this.bioPageService.findAll();
  }

  @Get('by-slug/:slug')
  @ApiOperation({ summary: 'صفحه اختصاصی عمومی بیولینک با اسلاگ (ثبت خودکار بازدید)' })
  findBySlug(@Param('slug') slug: string, @Req() req: Request) {
    const ip = req.ip || (req.headers['x-forwarded-for'] as string);
    const userAgent = req.headers['user-agent'];
    return this.bioPageService.findBySlug(slug, ip, userAgent);
  }

  @Get(':id')
  @ApiOperation({ summary: 'دریافت مشخصات بیولینک برای پنل کاربر' })
  @ApiHeader({ name: 'x-user-id', required: true })
  findOne(@Param('id') id: string, @Headers('x-user-id') userId: string) {
    if (!userId) throw new BadRequestException('هدر x-user-id الزامی است');
    return this.bioPageService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'ویرایش مشخصات بیولینک' })
  @ApiHeader({ name: 'x-user-id', required: true })
  update(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
    @Body() updateBioPageDto: UpdateBioPageDto,
  ) {
    if (!userId) throw new BadRequestException('هدر x-user-id الزامی است');
    return this.bioPageService.update(id, userId, updateBioPageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف صفحه بیولینک' })
  @ApiHeader({ name: 'x-user-id', required: true })
  remove(@Param('id') id: string, @Headers('x-user-id') userId: string) {
    if (!userId) throw new BadRequestException('هدر x-user-id الزامی است');
    return this.bioPageService.remove(id, userId);
  }
}
