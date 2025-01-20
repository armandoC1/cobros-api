import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}