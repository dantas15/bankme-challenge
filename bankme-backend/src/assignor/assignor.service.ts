import { Injectable } from '@nestjs/common';
import { CreateAssignorDto } from './dto/create-assignor.dto';
import { UpdateAssignorDto } from './dto/update-assignor.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssignorService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createAssignorDto: CreateAssignorDto) {
    return await this.prismaService.assignor.create({
      data: createAssignorDto,
    });
  }

  async findAll() {
    return await this.prismaService.assignor.findMany();
  }

  async findOne(id: string) {
    return await this.prismaService.assignor.findUnique({ where: { id } });
  }

  async update(id: string, updateAssignorDto: UpdateAssignorDto) {
    return await this.prismaService.assignor.update({
      where: { id },
      data: updateAssignorDto,
    });
  }

  async remove(id: string) {
    return await this.prismaService.assignor.delete({ where: { id } });
  }
}
