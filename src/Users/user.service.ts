import { ConflictException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async createUser(fullName: string): Promise<any> {
        try {
            const existingUser = await this.userRepository.findOne({ where: { fullName } });
            if (existingUser) {
                throw new ConflictException('A user with this name already exists');
            }

            const username = this.generateUsername(fullName);

            const user = this.userRepository.create({
                fullName,
                username,
                role: 'user'
            });

            const savedUser = await this.userRepository.save(user);

            return {
                ok: true,
                message: 'User created successfully',
                user: savedUser,
                status: HttpStatus.CREATED,
            }
        } catch (error) {
            throw new error(
                `Error => ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async remove(id: number): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { id } });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            user.isActive = false
            await this.userRepository.save(user);

            return {
                ok: true,
                messsage: 'User removed successfully',
            }

        } catch (error) {
            throw new error(
                `Error => ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findUserById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { username } });
    }

    async validatePassword(user: User, password: string): Promise<boolean> {
        if (!user.password) {
            return false;
        }
        return bcrypt.compare(password, user.password);
    }

    private generateUsername(fullName: string): string {
        const baseUsername = fullName.split(' ').join('').toLowerCase();
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        return `${baseUsername}${randomNumber}`;
    }
}