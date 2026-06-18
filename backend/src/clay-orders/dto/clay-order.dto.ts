import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ClayOrderStatus } from '@prisma/client';

export class CreateClayOrderDto {
  @IsString()
  customerName: string;

  @IsString()
  clayBody: string;

  @IsOptional()
  @IsString()
  supplierName?: string;

  @IsOptional()
  @IsEnum(ClayOrderStatus)
  status?: ClayOrderStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateClayOrderDto {
  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  clayBody?: string;

  @IsOptional()
  @IsString()
  supplierName?: string;

  @IsOptional()
  @IsEnum(ClayOrderStatus)
  status?: ClayOrderStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
