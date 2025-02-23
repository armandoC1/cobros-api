import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/Users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password?: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }
    if (user.role === 'admin' && password) {
      const isPasswordValid = await this.usersService.validatePassword(user, password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }
    } else if (user.role === 'admin') {
      throw new UnauthorizedException('Password required for admin');
    }

    const payload = { username: user.username, role: user.role };
    return {
      id: user.id,
      role: user.role,
      access_token: this.jwtService.sign(payload),
    };
  }
}
