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

  findAll() {
    return this.prismaService.assignor.findMany();
  }

  findOne(id: string) {
    return this.prismaService.assignor.findUnique({ where: { id } });
  }

  update(id: string, updateAssignorDto: UpdateAssignorDto) {
    return this.prismaService.assignor.update({
      where: { id },
      data: updateAssignorDto,
    });
  }

  remove(id: string) {
    return this.prismaService.assignor.delete({ where: { id } });
  }
}
