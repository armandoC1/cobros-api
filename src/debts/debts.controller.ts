import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { DebtService } from './debts.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateDetDto } from './dto/create-debts.dto';
import { SearchDebtsDto } from './dto/seach-debts.dto';
import { UpdateDateColumn } from 'typeorm';
import { UpdateDebtsDto } from './dto/update-debts.dto';

@Controller('debt')
export class DebtController {
  constructor(private readonly debtSerive: DebtService) {}

  @Post()
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  async create(@Body() createDebtDto: CreateDetDto) {
    return this.debtSerive.create(createDebtDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() searchdebtDto: SearchDebtsDto) {
    return this.debtSerive.findAll(searchdebtDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number) {
    return this.debtSerive.findOne(id);
  }

  @Get('customer/:id')
  @UseGuards(JwtAuthGuard)
  async findByCustomer(@Param('id') id: number) {
    return this.debtSerive.findByCustomer(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  async update(
    @Param('id') id: number,
    @Body() updateDebtsDto: UpdateDebtsDto,
  ) {
    return this.debtSerive.update(id, updateDebtsDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  async remove(@Param('id') id: number) {
    return this.debtSerive.remove(id);
  }
}
