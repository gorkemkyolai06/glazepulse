import { Module } from '@nestjs/common';
import { ClayOrdersController } from './clay-orders.controller';
import { ClayOrdersService } from './clay-orders.service';

@Module({
  controllers: [ClayOrdersController],
  providers: [ClayOrdersService],
})
export class ClayOrdersModule {}
