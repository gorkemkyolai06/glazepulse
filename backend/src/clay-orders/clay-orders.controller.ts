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
import { ClayOrdersService } from './clay-orders.service';
import { CreateClayOrderDto, UpdateClayOrderDto } from './dto/clay-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('clay-orders')
@UseGuards(JwtAuthGuard)
export class ClayOrdersController {
  constructor(private clayOrdersService: ClayOrdersService) {}

  @Get()
  list(
    @Request() req: { user: { potteryStudioId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('clayBody') clayBody?: string,
  ) {
    return this.clayOrdersService.list(req.user.potteryStudioId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      clayBody,
    });
  }

  @Get('pending')
  pending(@Request() req: { user: { potteryStudioId: string } }) {
    return this.clayOrdersService.pending(req.user.potteryStudioId);
  }

  @Get(':id')
  get(@Request() req: { user: { potteryStudioId: string } }, @Param('id') id: string) {
    return this.clayOrdersService.get(req.user.potteryStudioId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { potteryStudioId: string } },
    @Body() dto: CreateClayOrderDto,
  ) {
    return this.clayOrdersService.create(req.user.potteryStudioId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { potteryStudioId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateClayOrderDto,
  ) {
    return this.clayOrdersService.update(req.user.potteryStudioId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { potteryStudioId: string } }, @Param('id') id: string) {
    return this.clayOrdersService.remove(req.user.potteryStudioId, id);
  }
}
