import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateBioPageDto {
  @ApiProperty({ description: 'آیدی بیزینسی که این بیولینک متعلق به آن است' })
  @IsString()
  @IsNotEmpty()
  businessId: string;

  @ApiProperty({ description: 'اسلاگ یکتا برای آدرس صفحه (فقط حروف انگلیسی، عدد و خط تیره)', example: 'digikala-bio' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, { message: 'اسلاگ فقط می‌تواند شامل حروف کوچک انگلیسی، اعداد و خط تیره (-) باشد' })
  slug: string;

  @ApiProperty({ description: 'عنوان صفحه بیولینک', example: 'فروشگاه دیجی‌کالا' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false, description: 'توضیحات یا بیوگرافی' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ required: false, description: 'آدرس آواتار یا لوگو' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({ required: false, description: 'تنظیمات رنگ و تم (JSON)' })
  @IsOptional()
  themeConfig?: any;

  @ApiProperty({ required: false, description: 'عنوان سئو' })
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @ApiProperty({ required: false, description: 'توضیحات سئو' })
  @IsString()
  @IsOptional()
  seoDescription?: string;
}
