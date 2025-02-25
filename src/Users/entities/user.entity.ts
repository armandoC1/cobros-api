import { Debt } from "../../debts/entities/debts.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;
    
    @Column()
    username: string;

    @Column()
    password?: string;

    @Column({default : true})
    isActive: boolean

    @Column({default: 'user'})
    role: 'admin' | 'user';

    @OneToMany(() => Debt, (debt) => debt.customer) 
    debts: Debt[];
}