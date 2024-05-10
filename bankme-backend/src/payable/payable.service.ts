import { Injectable } from '@nestjs/common';
import { CreatePayableDto } from './dto/create-payable.dto';
import { UpdatePayableDto } from './dto/update-payable.dto';
import { faker } from '@faker-js/faker';

@Injectable()
export class PayableService {
  create(createPayableDto: CreatePayableDto) {
    console.log(`create payable`, { createPayableDto });
    return { ...createPayableDto, id: faker.string.uuid() };
  }

  findAll() {
    return `This action returns all payable`;
  }

  findOne(id: string) {
    return `This action returns a #${id} payable`;
  }

  update(id: string, updatePayableDto: UpdatePayableDto) {
    console.log(`update payable with id = ${id}`, { updatePayableDto });
    return `This action updates a #${id} payable`;
  }

  remove(id: string) {
    return `This action removes a #${id} payable`;
  }
}
