import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from '../user/user.module';
import { jwtConfig } from '../../config/auth.config';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConfig.secret,
      signOptions: { expiresIn: '1m' }, // 1m = 1 minute
    }),
  ],
  controllers: [AuthController],
  providers: [PrismaService, JwtService, UserService, AuthService],
})
export class AuthModule {}
