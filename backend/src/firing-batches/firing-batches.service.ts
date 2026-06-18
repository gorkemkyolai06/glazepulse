import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFiringBatchDto, UpdateFiringBatchDto } from './dto/firing-batch.dto';

@Injectable()
export class FiringBatchesService {
  constructor(private prisma: PrismaService) {}

  async list(potteryStudioId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { potteryStudioId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.firingBatch.findMany({
        where,
        orderBy: { scheduledAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          kiln: { select: { id: true, name: true, zone: true, kilnType: true } },
        },
      }),
      this.prisma.firingBatch.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(potteryStudioId: string, id: string) {
    const session = await this.prisma.firingBatch.findFirst({
      where: { id, potteryStudioId },
      include: { kiln: true },
    });
    if (!session) throw new NotFoundException('Ders oturumu bulunamadı');
    return session;
  }

  async create(potteryStudioId: string, dto: CreateFiringBatchDto) {
    return this.prisma.firingBatch.create({
      data: {
        ...dto,
        potteryStudioId,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : new Date(),
      },
      include: { kiln: true },
    });
  }

  async update(potteryStudioId: string, id: string, dto: UpdateFiringBatchDto) {
    await this.get(potteryStudioId, id);
    const data = { ...dto };
    if (dto.scheduledAt) {
      (data as { scheduledAt?: Date }).scheduledAt = new Date(dto.scheduledAt);
    }
    return this.prisma.firingBatch.update({
      where: { id },
      data,
      include: { kiln: true },
    });
  }

  async remove(potteryStudioId: string, id: string) {
    await this.get(potteryStudioId, id);
    return this.prisma.firingBatch.delete({ where: { id } });
  }
}
