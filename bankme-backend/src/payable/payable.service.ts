import { Injectable } from '@nestjs/common';
import { CreatePayableDto } from './dto/create-payable.dto';
import { UpdatePayableDto } from './dto/update-payable.dto';

@Injectable()
export class PayableService {
  create(createPayableDto: CreatePayableDto) {
    return createPayableDto;
  }

  findAll() {
    return `This action returns all payable`;
  }

  findOne(id: string) {
    return `This action returns a #${id} payable`;
  }

  update(id: string, updatePayableDto: UpdatePayableDto) {
    console.log(`update payable with id = ${id}`, { updatePayableDto });
    return {
      dataChanged: `${Object.keys(updatePayableDto)
        .filter((k) => !!k)
        .join('')}`,
    };
  }

  remove(id: string) {
    return `This action removes a #${id} payable`;
  }
}
