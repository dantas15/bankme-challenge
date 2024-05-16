import { Injectable } from '@nestjs/common';
import { CreatePayableDto } from './dto/create-payable.dto';
import { UpdatePayableDto } from './dto/update-payable.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AssignorNotFoundException } from '../../exceptions/assignor-not-found.exception';

@Injectable()
export class PayableService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ assignorId, emissionDate, value }: CreatePayableDto) {
    const assignorExists = await this.assignorExists(assignorId);

    if (!assignorExists) {
      throw new AssignorNotFoundException(assignorId);
    }

    return await this.prismaService.payable.create({
      data: {
        assignor: { connect: { id: assignorId } },
        emissionDate: new Date(emissionDate),
        value,
      },
    });
  }

  async findAll() {
    return await this.prismaService.payable.findMany();
  }

  async findOne(id: string) {
    return await this.prismaService.payable.findUnique({ where: { id } });
  }

  async update(
    id: string,
    { assignorId, emissionDate, value }: UpdatePayableDto,
  ) {
    const newPayableData = {
      emissionDate: emissionDate ? new Date(emissionDate) : undefined,
      value,
    };
    if (!assignorId) {
      return await this.prismaService.payable.update({
        where: { id },
        data: newPayableData,
      });
    }

    const newAssignorExists = await this.assignorExists(assignorId);

    if (!newAssignorExists) {
      throw new AssignorNotFoundException(assignorId);
    }

    return await this.prismaService.payable.update({
      where: { id },
      data: { ...newPayableData, assignor: { connect: { id: assignorId } } },
    });
  }

  async remove(id: string) {
    return await this.prismaService.payable.delete({ where: { id } });
  }

  async assignorExists(assignorId: string) {
    return !!(await this.prismaService.assignor.findUnique({
      where: { id: assignorId },
    }));
  }
}
