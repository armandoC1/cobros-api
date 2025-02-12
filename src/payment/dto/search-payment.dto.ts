import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/paginationDto';

export class SearchPaymentDto extends PartialType(PaginationDto) {
  @IsOptional()
  startDate?: string;

  @IsOptional()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  active?: number = 1;
}
