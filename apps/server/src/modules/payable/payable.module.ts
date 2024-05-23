import { Module } from '@nestjs/common';
import { PayableService } from './payable.service';
import { PayableController } from './payable.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PayableController],
  providers: [PrismaService, PayableService],
})
export class PayableModule {}
