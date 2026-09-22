import { 
  Injectable, 
  ForbiddenException, 
  NotFoundException 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  // ۱. ایجاد بیزینس با چک کردن سقف پلن کاربر
  async create(userId: string, data: CreateBusinessDto) {
    // گرفتن آخرین اشتراک فعال کاربر به همراه پلن
    const activeSub = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
      },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });

    // سقف پیش‌فرض ۱ است، اگر اشتراک فعال داشت از پلن می‌خواند
    const maxAllowed = activeSub?.plan?.maxBusinesses ?? 1;

    // تعداد بیزینس‌های فعلی کاربر
    const currentBusinessCount = await this.prisma.business.count({
      where: { userId },
    });

    if (currentBusinessCount >= maxAllowed) {
      throw new ForbiddenException(
        `شما به سقف مجاز ساخت بیزینس (${maxAllowed} عدد) بر اساس طرح خود رسیده‌اید. برای ساخت بیزینس بیشتر طرح خود را ارتقا دهید.`,
      );
    }

    return this.prisma.business.create({
      data: {
        ...data,
        userId,
      },
      include: {
        bioPages: true,
      },
    });
  }

  // ۲. نمایش تمام بیزینس‌ها (عمومی / برای صفحه لیست کل بیزینس‌ها)
  async findAll() {
    return this.prisma.business.findMany({
      include: {
        bioPages: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ۳. نمایش بیزینس‌های یک کاربر خاص
  async findAllByUser(userId: string) {
    return this.prisma.business.findMany({
      where: { userId },
      include: {
        bioPages: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ۴. دریافت یک بیزینس بر اساس ID (صفحه اختصاصی بیزینس)
  async findOne(id: string) {
    const business = await this.prisma.business.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
        bioPages: {
          include: {
            blocks: true,
          },
        },
      },
    });

    if (!business) {
      throw new NotFoundException('بیزینس مورد نظر یافت نشد.');
    }

    return business;
  }

  // ۵. ویرایش بیزینس
  async update(id: string, userId: string, data: UpdateBusinessDto) {
    const business = await this.prisma.business.findFirst({
      where: { id, userId },
    });

    if (!business) {
      throw new NotFoundException('بیزینس یافت نشد یا شما دسترسی ویرایش آن را ندارید.');
    }

    return this.prisma.business.update({
      where: { id },
      data,
    });
  }

  // ۶. حذف بیزینس
  async remove(id: string, userId: string) {
    const business = await this.prisma.business.findFirst({
      where: { id, userId },
    });

    if (!business) {
      throw new NotFoundException('بیزینس یافت نشد یا شما دسترسی حذف آن را ندارید.');
    }

    return this.prisma.business.delete({
      where: { id },
    });
  }
}
