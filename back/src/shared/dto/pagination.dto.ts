import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export type FilterOperator = 'equals' | 'contains' | 'in' | 'gt' | 'lt';

export class FilterDto {
  @IsString()
  field: string;

  @IsString()
  @IsOptional()
  operator?: FilterOperator;

  @IsString()
  Value: string;
}

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  limit?: number = 20; // Default to 20 if not provided

  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string | null }) =>
    value === null ? undefined : value,
  )
  afterCursor?: string | undefined;

  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string | null }) =>
    value === null ? undefined : value,
  )
  beforeCursor?: string | undefined;

  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterDto)
  filters?: FilterDto[];
}
