import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class Locale {
  @ApiProperty()
  @IsNotEmpty()
  en!: string;
  @ApiProperty()
  am?: string;
  @ApiProperty()
  om?: string;
  @ApiProperty()
  ti?: string;
  @ApiProperty()
  so?: string;
}
