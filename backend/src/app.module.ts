import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PotteryStudioModule } from './pottery-studio/pottery-studio.module';
import { KilnsModule } from './kilns/kilns.module';
import { FiringBatchesModule } from './firing-batches/firing-batches.module';
import { KilnMaintenanceModule } from './kiln-maintenance/kiln-maintenance.module';
import { GlazeChecklistModule } from './glaze-checklists/glaze-checklists.module';
import { FiringRatesModule } from './firing-rates/firing-rates.module';
import { ClayOrdersModule } from './clay-orders/clay-orders.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    PotteryStudioModule,
    KilnsModule,
    FiringBatchesModule,
    KilnMaintenanceModule,
    GlazeChecklistModule,
    FiringRatesModule,
    ClayOrdersModule,
    DashboardModule,
  ],
})
export class AppModule {}
