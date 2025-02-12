import { Debt } from 'src/debts/entities/debts.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  paymentDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Debt, (debt) => debt.payments, { eager: true })
  @JoinColumn({ name: 'debtId' })
  debt: Debt;

  @Column({ nullable: false })
  debtId: number;
}
