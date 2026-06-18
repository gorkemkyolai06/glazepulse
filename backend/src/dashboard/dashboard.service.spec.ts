import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;

  const mockPrisma = {
    potteryStudio: { findUnique: jest.fn() },
    kiln: { count: jest.fn(), groupBy: jest.fn() },
    firingBatch: {
      count: jest.fn(),
      aggregate: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
    },
    kilnMaintenance: { count: jest.fn(), findMany: jest.fn().mockResolvedValue([]) },
    glazeChecklist: { count: jest.fn() },
    firingRate: { count: jest.fn() },
    clayOrder: { count: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    jest.clearAllMocks();
  });

  it('should return pottering shop dashboard stats', async () => {
    mockPrisma.potteryStudio.findUnique.mockResolvedValue({ totalKilns: 8 });
    mockPrisma.kiln.count
      .mockResolvedValueOnce(8)
      .mockResolvedValueOnce(4)
      .mockResolvedValueOnce(2);
    mockPrisma.firingBatch.count.mockResolvedValue(42);
    mockPrisma.kilnMaintenance.count
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(1);
    mockPrisma.firingBatch.aggregate.mockResolvedValue({
      _sum: { cashAmount: 120, cardAmount: 280, coneAdjustment: 95 },
    });
    mockPrisma.firingBatch.findMany.mockResolvedValue([]);
    mockPrisma.kilnMaintenance.findMany.mockResolvedValue([]);
    mockPrisma.glazeChecklist.count.mockResolvedValue(2);
    mockPrisma.firingRate.count.mockResolvedValue(3);
    mockPrisma.clayOrder.count
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(2);
    mockPrisma.kiln.groupBy.mockResolvedValue([
      { zone: 'East Zone', _count: { id: 3 } },
      { zone: 'West Zone', _count: { id: 3 } },
    ]);

    const stats = await service.getStats('shop-1');

    expect(stats).toHaveProperty('kilnUtilizationRate');
    expect(stats).toHaveProperty('dailyRevenue', 495);
    expect(stats).toHaveProperty('dailyConeAdjustments', 95);
    expect(stats).toHaveProperty('studioZones');
    expect(stats).toHaveProperty('urgentKilnMaintenance');
    expect(stats).toHaveProperty('pendingGlazeChecklist');
    expect(stats).toHaveProperty('activeFiringRates', 3);
    expect(stats).toHaveProperty('pendingClayOrders', 3);
    expect(stats).toHaveProperty('completedClayOrders', 2);
    expect(stats).toHaveProperty('availableKilns', 4);
    expect(stats).toHaveProperty('totalKilns', 8);
  });
});
