import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const STUDIO_ID = '00000000-0000-0000-0000-000000000001';

async function main() {
  const passwordHash = await bcrypt.hash('demo123456', 12);

  await prisma.potteryStudio.upsert({
    where: { id: STUDIO_ID },
    update: {},
    create: {
      id: STUDIO_ID,
      name: 'Claywheel Pottery Studio',
      phone: '+13125550142',
      address: '142 Michigan Avenue',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      totalKilns: 6,
      timezone: 'America/Chicago',
      users: {
        create: {
          email: 'demo@claywheelstudio.com',
          passwordHash,
          firstName: 'Elif',
          lastName: 'Kara',
          role: 'owner',
        },
      },
    },
  });

  const kilnData = [
    {
      id: '00000000-0000-0000-0000-000000000101',
      name: 'Kiln A — Elektrik',
      zone: 'Ana Stüdyo',
      kilnType: 'electric' as const,
      kilnModel: 'Skutt KM-1027',
      status: 'available' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000102',
      name: 'Kiln B — Gaz',
      zone: 'Ana Stüdyo',
      kilnType: 'gas' as const,
      kilnModel: 'Brent B-Plus',
      status: 'firing' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000103',
      name: 'Kiln C — Raku',
      zone: 'Dış Alan',
      kilnType: 'raku' as const,
      kilnModel: 'Olympic Raku',
      status: 'available' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000104',
      name: 'Kiln D — Odun',
      zone: 'Dış Alan',
      kilnType: 'wood' as const,
      kilnModel: 'Anagama Wood Kiln',
      status: 'cooling' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000105',
      name: 'Test Fırını',
      zone: 'Laboratuvar',
      kilnType: 'studio' as const,
      kilnModel: 'Paragon SC-2',
      status: 'maintenance' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000106',
      name: 'Sır Fırını',
      zone: 'Sır Odası',
      kilnType: 'electric' as const,
      kilnModel: 'L&L E23T-3',
      status: 'offline' as const,
    },
  ];

  const kilns = [];
  for (const kiln of kilnData) {
    const created = await prisma.kiln.upsert({
      where: { id: kiln.id },
      update: {},
      create: { ...kiln, potteryStudioId: STUDIO_ID },
    });
    kilns.push(created);
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.firingBatch.upsert({
    where: { id: '00000000-0000-0000-0000-000000000201' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000201',
      potteryStudioId: STUDIO_ID,
      kilnId: kilns[2].id,
      scheduledAt: yesterday,
      firingType: 'glaze',
      cashAmount: 0,
      cardAmount: 285.0,
      itemCount: 24,
      coneAdjustment: 15.0,
      status: 'completed',
      notes: 'Cone 6 sır pişirimi — öğrenci çalışmaları',
    },
  });

  await prisma.firingBatch.upsert({
    where: { id: '00000000-0000-0000-0000-000000000202' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000202',
      potteryStudioId: STUDIO_ID,
      kilnId: kilns[1].id,
      scheduledAt: new Date(),
      firingType: 'bisque',
      cashAmount: 120.0,
      cardAmount: 0,
      itemCount: 18,
      coneAdjustment: 0,
      status: 'firing',
      notes: 'Cone 04 bisküvi pişirimi',
    },
  });

  await prisma.kilnMaintenance.upsert({
    where: { id: '00000000-0000-0000-0000-000000000301' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000301',
      potteryStudioId: STUDIO_ID,
      kilnId: kilns[4].id,
      title: 'Termokupl değişimi',
      description: 'Tip K termokupl arızalı, değiştirilmeli',
      reportedAt: new Date(),
      priority: 'urgent',
      status: 'open',
      cost: 185.0,
    },
  });

  await prisma.kilnMaintenance.upsert({
    where: { id: '00000000-0000-0000-0000-000000000302' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000302',
      potteryStudioId: STUDIO_ID,
      kilnId: kilns[0].id,
      title: 'Eleman kontrolü',
      description: 'Yıllık rutin eleman kontrolü',
      reportedAt: new Date(),
      priority: 'medium',
      status: 'in_progress',
    },
  });

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);

  await prisma.glazeChecklist.upsert({
    where: { id: '00000000-0000-0000-0000-000000000401' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000401',
      potteryStudioId: STUDIO_ID,
      title: 'Celadon sır karışımı',
      description: 'Yeni parti celadon sırı hazırlanacak',
      category: 'mixing',
      zone: 'Sır Odası',
      scheduledAt: nextWeek,
      status: 'scheduled',
    },
  });

  await prisma.glazeChecklist.upsert({
    where: { id: '00000000-0000-0000-0000-000000000402' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000402',
      potteryStudioId: STUDIO_ID,
      title: 'Tenmoku test plakaları',
      category: 'testing',
      zone: 'Laboratuvar',
      scheduledAt: new Date(),
      status: 'in_progress',
    },
  });

  await prisma.firingRate.upsert({
    where: { id: '00000000-0000-0000-0000-000000000501' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000501',
      potteryStudioId: STUDIO_ID,
      title: 'Bisküvi Pişirimi — Cone 04',
      rateCategory: 'bisque_firing',
      status: 'active',
      basePrice: 45.0,
      priceMultiplier: 1.0,
      notes: 'Küp fiyatı, minimum 10 parça',
    },
  });

  await prisma.firingRate.upsert({
    where: { id: '00000000-0000-0000-0000-000000000502' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000502',
      potteryStudioId: STUDIO_ID,
      title: 'Raku Seansı',
      rateCategory: 'raku_session',
      status: 'active',
      basePrice: 75.0,
      priceMultiplier: 1.5,
      notes: 'Hafta sonu raku atölyesi',
    },
  });

  await prisma.clayOrder.upsert({
    where: { id: '00000000-0000-0000-0000-000000000601' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000601',
      potteryStudioId: STUDIO_ID,
      customerName: 'Laguna Clay Co.',
      clayBody: 'B-Mix Cone 5',
      supplierName: 'Laguna Clay',
      status: 'pending',
      price: 420.0,
      notes: '50 lb torba x 6',
    },
  });

  await prisma.clayOrder.upsert({
    where: { id: '00000000-0000-0000-0000-000000000602' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000602',
      potteryStudioId: STUDIO_ID,
      customerName: 'Standard Ceramic',
      clayBody: 'Speckled Stoneware',
      supplierName: 'Standard Ceramic',
      status: 'in_progress',
      price: 280.0,
    },
  });

  console.log('GlazePulse seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
