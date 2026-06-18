import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { FiringBatchesService } from './firing-batches.service';
import { CreateFiringBatchDto, UpdateFiringBatchDto } from './dto/firing-batch.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('firing-batches')
@UseGuards(JwtAuthGuard)
export class FiringBatchesController {
  constructor(private firingBatchesService: FiringBatchesService) {}

  @Get()
  list(
    @Request() req: { user: { potteryStudioId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.firingBatchesService.list(req.user.potteryStudioId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { potteryStudioId: string } }, @Param('id') id: string) {
    return this.firingBatchesService.get(req.user.potteryStudioId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { potteryStudioId: string } },
    @Body() dto: CreateFiringBatchDto,
  ) {
    return this.firingBatchesService.create(req.user.potteryStudioId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { potteryStudioId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateFiringBatchDto,
  ) {
    return this.firingBatchesService.update(req.user.potteryStudioId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { potteryStudioId: string } }, @Param('id') id: string) {
    return this.firingBatchesService.remove(req.user.potteryStudioId, id);
  }
}
