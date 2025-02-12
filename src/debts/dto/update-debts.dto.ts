import { PartialType } from "@nestjs/swagger";
import { CreateDetDto } from "./create-debts.dto";


export class UpdateDebtsDto extends PartialType(CreateDetDto){}
