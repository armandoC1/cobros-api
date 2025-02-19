import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  async createUser(@Body() body: { fullName: string }) {
    return this.usersService.createUser(body.fullName);
  }

  @Get()
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  async findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Get()
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  async findAll() {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number) {
    return this.usersService.findUserById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  async removeUser(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
