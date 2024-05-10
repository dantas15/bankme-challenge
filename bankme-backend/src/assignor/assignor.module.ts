import { Module } from '@nestjs/common';
import { AssignorService } from './assignor.service';
import { AssignorController } from './assignor.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AssignorController],
  providers: [PrismaService, AssignorService],
})
export class AssignorModule {}
