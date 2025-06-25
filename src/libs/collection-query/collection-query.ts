import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { FilterOperators } from './filter-operators';
export class CollectionQuery {
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  top?: number;
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  skip?: number;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  offset?: number;

  @ApiProperty()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  orderBy?: Order[];
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  @IsArray()
  @ApiPropertyOptional()
  searchFrom?: string[];

  @ApiProperty()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  @IsOptional()
  // @ApiProperty({
  //   type: [[[Number]]],
  //   description: 'Multi-dimensional array of numbers',
  //   example: [[[0, 0], [3, 4]], [[5, 6], [7, 8]]],
  // })
  @ApiPropertyOptional()
  filter?: Filter[][];

  @ApiProperty()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  includes?: string[];

  @ApiProperty()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  select?: string[];
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  locale?: string;

  @ApiProperty()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  @ApiPropertyOptional()
  @IsOptional()
  groupBy?: string[];
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  count?: boolean;
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  withArchived?: boolean = false;
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  distinct?: boolean;
  @ApiProperty()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  @ApiPropertyOptional()
  @IsOptional()
  distinctOn?: string[];
  @IsOptional()
  @ApiPropertyOptional()
  cache?: boolean | number; //milliseconds
}
enum Direction {
  ASC = 'ASC',
  DESC = 'DESC',
}
export class Order {
  @ApiProperty()
  @IsString()
  field?: string;
  @ApiProperty()
  @IsEnum(Direction, {
    message: 'Direction must be either "ASC" or "DESC"',
  })
  direction?: string;

  @ApiProperty()
  @IsEnum(Direction, {
    message: 'nulls must be either "NULLS FIRST" or "NULLS LAST',
  })
  nulls?: string;
}

export class Filter {
  @ApiProperty()
  @IsString()
  field!: string;
  @ApiProperty()
  // @IsString()
  value?: any;
  @ApiProperty()
  @IsEnum(FilterOperators, {
    message: `Operator must be one of ${Object.keys(
      FilterOperators,
    ).toString()}`,
  })
  operator?: string;
}
export class IncludeQuery {
  @ApiProperty()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  includes?: string[];
}
