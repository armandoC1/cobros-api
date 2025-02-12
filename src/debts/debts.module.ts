import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/Users/entities/user.entity';
import { DebtController } from './debts.controller';
import { DebtService } from './debts.service';
import { Debt } from './entities/debts.entity';
import { Payment } from 'src/payment/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Debt, User,Payment]),
  ],
  controllers: [DebtController], 
  providers: [DebtService], 
  exports: [DebtService], 
})
export class DebtModule {}
