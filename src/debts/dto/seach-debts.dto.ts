import { PartialType } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { PaginationDto } from "../../paginationDto";

export class SearchDebtsDto extends PartialType(PaginationDto){
   
    @IsOptional()
    @IsNumber()
    customer?: string = ' ' 

    @IsOptional()
    @IsNumber()
    active?: number = 1
}