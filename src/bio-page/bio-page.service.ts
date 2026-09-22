import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBioPageDto } from './dto/create-bio-page.dto';
import { UpdateBioPageDto } from './dto/update-bio-page.dto';

@Injectable()
export class BioPageService {
  constructor(private prisma: PrismaService) {}

  // ۱. ساخت صفحه بیولینک جدید
  async create(userId: string, data: CreateBioPageDto) {
    // بررسی مالکیت بیزینس
    const business = await this.prisma.business.findFirst({
      where: { id: data.businessId, userId },
    });

    if (!business) {
      throw new ForbiddenException('بیزینس یافت نشد یا شما مالک آن نیستید.');
    }

    // بررسی تکراری نبودن اسلاگ
    const slugExists = await this.prisma.bioPage.findUnique({
      where: { slug: data.slug.toLowerCase() },
    });

    if (slugExists) {
      throw new ConflictException('این اسلاگ قبلاً ثبت شده است. نام دیگری انتخاب کنید.');
    }

    return this.prisma.bioPage.create({
      data: {
        ...data,
        slug: data.slug.toLowerCase(),
      },
      include: {
        business: true,
      },
    });
  }

  // ۲. دریافت همه بیولینک‌ها (برای صفحه لیست کل بیولینک‌ها)
  async findAll() {
    return this.prisma.bioPage.findMany({
      where: { isActive: true },
      include: {
        business: {
          select: { id: true, name: true, logoUrl: true },
        },
        _count: {
          select: { blocks: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ۳. دریافت صفحه اختصاصی عمومی بر اساس slug + افزایش بازدید (Analytics)
  async findBySlug(slug: string, ipAddress?: string, userAgent?: string) {
    const page = await this.prisma.bioPage.findUnique({
      where: { slug: slug.toLowerCase() },
      include: {
        business: true,
        blocks: {
          where: { isActive: true },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!page || !page.isActive) {
      throw new NotFoundException('صفحه بیولینک یافت نشد یا غیرفعال است.');
    }

    // ثبت بازدید و افزایش شمارنده به شکل موازی در بک‌گراند
    this.prisma.$transaction([
      this.prisma.bioPage.update({
        where: { id: page.id },
        data: { viewCount: { increment: 1 } },
      }),
      this.prisma.pageView.create({
        data: {
          bioPageId: page.id,
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
        },
      }),
    ]).catch(() => {
      // ثبت نشدن آمار نباید لود صفحه را مختل کند
    });

    return page;
  }

  // ۴. دریافت جزئیات صفحه برای پنل مدیریت کاربر
  async findOne(id: string, userId: string) {
    const page = await this.prisma.bioPage.findFirst({
      where: {
        id,
        business: { userId },
      },
      include: {
        business: true,
        blocks: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!page) {
      throw new NotFoundException('صفحه بیولینک یافت نشد یا دسترسی ندارید.');
    }

    return page;
  }

  // ۵. ویرایش صفحه بیولینک
  async update(id: string, userId: string, data: UpdateBioPageDto) {
    const page = await this.prisma.bioPage.findFirst({
      where: { id, business: { userId } },
    });

    if (!page) {
      throw new NotFoundException('صفحه یافت نشد یا اجازه ویرایش ندارید.');
    }

    if (data.slug && data.slug.toLowerCase() !== page.slug) {
      const slugExists = await this.prisma.bioPage.findUnique({
        where: { slug: data.slug.toLowerCase() },
      });
      if (slugExists) {
        throw new ConflictException('این اسلاگ قبلاً ثبت شده است.');
      }
    }

    return this.prisma.bioPage.update({
      where: { id },
      data: {
        ...data,
        slug: data.slug ? data.slug.toLowerCase() : undefined,
      },
    });
  }

  // ۶. حذف صفحه بیولینک
  async remove(id: string, userId: string) {
    const page = await this.prisma.bioPage.findFirst({
      where: { id, business: { userId } },
    });

    if (!page) {
      throw new NotFoundException('صفحه یافت نشد یا دسترسی ندارید.');
    }

    return this.prisma.bioPage.delete({
      where: { id },
    });
  }
}
