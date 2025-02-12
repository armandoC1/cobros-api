import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePaymentDto {
    
    @IsNumber()
    @IsNotEmpty()
    amount: number

    @IsString()
    @IsNotEmpty()
    paymentDate: string

    @IsNumber()
    debtId: number
    
}