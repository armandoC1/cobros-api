import { Controller, Post, Body, Header } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'POST, OPTIONS')
  @Header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  async login(@Body() body: { username: string; password?: string }) {
    const { username, password } = body;
    return this.authService.login(username, password);
  }
}
