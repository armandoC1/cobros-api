import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/Users/user.module';

@Module({
  imports: [
    UserModule, 
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    JwtModule.register({
      secret: 'SECRET_KEY', 
      signOptions: { expiresIn: '12h' }, 
    }),
  ],
  controllers: [AuthController], 
  providers: [AuthService, JwtStrategy], 
  exports: [AuthService], 
})
export class AuthModule {}
