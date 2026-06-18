import { Module } from '@nestjs/common';
import { FiringBatchesController } from './firing-batches.controller';
import { FiringBatchesService } from './firing-batches.service';

@Module({
  controllers: [FiringBatchesController],
  providers: [FiringBatchesService],
})
export class FiringBatchesModule {}
