import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { FiringType, BatchStatus } from '@prisma/client';

export class CreateFiringBatchDto {
  @IsUUID()
  kilnId: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsEnum(FiringType)
  firingType?: FiringType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cashAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cardAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  itemCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  coneAdjustment?: number;

  @IsOptional()
  @IsEnum(BatchStatus)
  status?: BatchStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateFiringBatchDto {
  @IsOptional()
  @IsUUID()
  kilnId?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsEnum(FiringType)
  firingType?: FiringType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cashAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cardAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  itemCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  coneAdjustment?: number;

  @IsOptional()
  @IsEnum(BatchStatus)
  status?: BatchStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
