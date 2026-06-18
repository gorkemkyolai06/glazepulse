import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClayOrderDto, UpdateClayOrderDto } from './dto/clay-order.dto';

@Injectable()
export class ClayOrdersService {
  constructor(private prisma: PrismaService) {}

  async list(
    potteryStudioId: string,
    params: { page?: number; status?: string; clayBody?: string },
  ) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { potteryStudioId };
    if (params.status) where.status = params.status;
    if (params.clayBody) where.clayBody = params.clayBody;

    const [data, total] = await Promise.all([
      this.prisma.clayOrder.findMany({
        where,
        orderBy: [{ status: 'asc' }, { customerName: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.clayOrder.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async pending(potteryStudioId: string) {
    return this.prisma.clayOrder.findMany({
      where: { potteryStudioId, status: { in: ['pending', 'in_progress'] } },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });
  }

  async get(potteryStudioId: string, id: string) {
    const order = await this.prisma.clayOrder.findFirst({
      where: { id, potteryStudioId },
    });
    if (!order) throw new NotFoundException('Tel gerdirme siparişi bulunamadı');
    return order;
  }

  async create(potteryStudioId: string, dto: CreateClayOrderDto) {
    return this.prisma.clayOrder.create({ data: { ...dto, potteryStudioId } });
  }

  async update(potteryStudioId: string, id: string, dto: UpdateClayOrderDto) {
    await this.get(potteryStudioId, id);
    return this.prisma.clayOrder.update({ where: { id }, data: dto });
  }

  async remove(potteryStudioId: string, id: string) {
    await this.get(potteryStudioId, id);
    return this.prisma.clayOrder.delete({ where: { id } });
  }
}
