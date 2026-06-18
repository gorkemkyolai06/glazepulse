import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(potteryStudioId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      potteryStudio,
      totalKilns,
      availableKilns,
      firingKilns,
      totalBatches,
      openKilnMaintenance,
      urgentKilnMaintenance,
      pendingGlazeChecklist,
      activeFiringRates,
      pendingClayOrders,
      completedClayOrders,
      revenueTotals,
      recentBatches,
      recentKilnMaintenance,
      studioZones,
    ] = await Promise.all([
      this.prisma.potteryStudio.findUnique({ where: { id: potteryStudioId } }),
      this.prisma.kiln.count({ where: { potteryStudioId } }),
      this.prisma.kiln.count({ where: { potteryStudioId, status: 'available' } }),
      this.prisma.kiln.count({ where: { potteryStudioId, status: 'firing' } }),
      this.prisma.firingBatch.count({ where: { potteryStudioId } }),
      this.prisma.kilnMaintenance.count({
        where: { potteryStudioId, status: { in: ['open', 'in_progress'] } },
      }),
      this.prisma.kilnMaintenance.count({
        where: {
          potteryStudioId,
          status: { in: ['open', 'in_progress'] },
          priority: { in: ['high', 'urgent'] },
        },
      }),
      this.prisma.glazeChecklist.count({
        where: {
          potteryStudioId,
          status: { in: ['scheduled', 'overdue'] },
          scheduledAt: { lte: sevenDaysLater },
        },
      }),
      this.prisma.firingRate.count({
        where: { potteryStudioId, status: 'active' },
      }),
      this.prisma.clayOrder.count({
        where: { potteryStudioId, status: { in: ['pending', 'in_progress'] } },
      }),
      this.prisma.clayOrder.count({
        where: { potteryStudioId, status: { in: ['completed', 'delivered'] } },
      }),
      this.prisma.firingBatch.aggregate({
        where: { potteryStudioId, scheduledAt: { gte: today } },
        _sum: { cashAmount: true, cardAmount: true, coneAdjustment: true },
      }),
      this.prisma.firingBatch.findMany({
        where: { potteryStudioId },
        include: {
          kiln: { select: { name: true, zone: true, kilnType: true } },
        },
        orderBy: { scheduledAt: 'desc' },
        take: 5,
      }),
      this.prisma.kilnMaintenance.findMany({
        where: { potteryStudioId, status: { in: ['open', 'in_progress'] } },
        include: {
          kiln: { select: { name: true, zone: true } },
        },
        orderBy: { reportedAt: 'desc' },
        take: 5,
      }),
      this.prisma.kiln.groupBy({
        by: ['zone'],
        where: { potteryStudioId },
        _count: { id: true },
      }),
    ]);

    const totalCapacity = potteryStudio?.totalKilns || totalKilns || 1;
    const kilnUtilizationRate =
      totalKilns > 0 ? Math.round((firingKilns / totalKilns) * 1000) / 10 : 0;

    const dailyRevenue =
      (revenueTotals._sum.cashAmount || 0) +
      (revenueTotals._sum.cardAmount || 0) +
      (revenueTotals._sum.coneAdjustment || 0);

    const dailyConeAdjustments = revenueTotals._sum.coneAdjustment || 0;

    const monthlyTrend = await this.getMonthlyTrend(potteryStudioId, sixMonthsAgo);

    return {
      totalKilns,
      availableKilns,
      firingKilns,
      totalCapacity,
      kilnUtilizationRate,
      totalBatches,
      openKilnMaintenance,
      urgentKilnMaintenance,
      pendingGlazeChecklist,
      activeFiringRates,
      pendingClayOrders,
      completedClayOrders,
      dailyRevenue,
      dailyConeAdjustments,
      recentBatches,
      recentKilnMaintenance,
      studioZones: studioZones.map((w) => ({
        zone: w.zone,
        kilnCount: w._count.id,
      })),
      monthlyTrend,
    };
  }

  private async getMonthlyTrend(potteryStudioId: string, since: Date) {
    const sessions = await this.prisma.firingBatch.findMany({
      where: { potteryStudioId, scheduledAt: { gte: since } },
      select: {
        scheduledAt: true,
        cashAmount: true,
        cardAmount: true,
        coneAdjustment: true,
        itemCount: true,
      },
    });

    const months: Record<string, { games: number; revenue: number; itemCount: number }> = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[key] = { games: 0, revenue: 0, itemCount: 0 };
    }

    sessions.forEach((session) => {
      const key = `${session.scheduledAt.getFullYear()}-${String(session.scheduledAt.getMonth() + 1).padStart(2, '0')}`;
      if (months[key]) {
        months[key].games++;
        months[key].revenue +=
          session.cashAmount + session.cardAmount + session.coneAdjustment;
        months[key].itemCount += session.itemCount;
      }
    });

    return Object.entries(months).map(([month, data]) => ({
      month,
      ...data,
    }));
  }
}
