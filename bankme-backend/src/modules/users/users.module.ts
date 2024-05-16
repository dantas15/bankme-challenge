import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [PrismaService, UsersService],
  exports: [UsersModule],
})
export class UsersModule {}
