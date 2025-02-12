import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateDetDto {
    
    @IsOptional()
    @IsString()
    descripcion?: string

    @IsNotEmpty()
    @IsNumber()
    amount: number

    @IsNumber()
    @IsNotEmpty()
    amountPaid: number

    @IsNumber()
    @IsOptional()
    remainingAmount: number

    @IsString()
    @IsNotEmpty()
    registationDate: string

    @IsNumber()
    customerId: number

    @IsBoolean()
    isActive: boolean 
}