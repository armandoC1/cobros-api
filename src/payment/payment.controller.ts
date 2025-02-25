import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { SearchPaymentDto } from './dto/search-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() searchPaymentDto: SearchPaymentDto) {
    return this.paymentService.findAll(searchPaymentDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number) {
    return this.paymentService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  async update(
    @Param('id') id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  async remove(@Param('id') id: number) {
    return this.paymentService.remove(id);
  }
}
