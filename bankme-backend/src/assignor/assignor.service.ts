import { Injectable } from '@nestjs/common';
import { CreateAssignorDto } from './dto/create-assignor.dto';
import { UpdateAssignorDto } from './dto/update-assignor.dto';

@Injectable()
export class AssignorService {
  create(createAssignorDto: CreateAssignorDto) {
    return createAssignorDto;
  }

  findAll() {
    return `This action returns all assignor`;
  }

  findOne(id: string) {
    return `This action returns a #${id} assignor`;
  }

  update(id: string, updateAssignorDto: UpdateAssignorDto) {
    return `This action updates a #${id} assignor`;
  }

  remove(id: string) {
    return `This action removes a #${id} assignor`;
  }
}
