import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateBioPageDto } from './create-bio-page.dto';

// بیزینس‌آیدی بعد از ساخت نباید عوض شود
export class UpdateBioPageDto extends PartialType(
  OmitType(CreateBioPageDto, ['businessId'] as const),
) {}
