import { Payment } from "src/payment/entities/payment.entity";
import { User } from "src/Users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Debt {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    descripcion?: string

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    amountPaid: number;

    @Column('decimal', { precision: 10, scale: 2 })
    remainingAmount: number;

    @Column()
    registrationDate: Date;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => User, (user) => user.debts)
    @JoinColumn({ name: 'customerId' })
    customer: User;
  
    @Column()
    customerId: number;
  
    @OneToMany(() => Payment, (payment) => payment.debt) 
    payments: Payment[];
}