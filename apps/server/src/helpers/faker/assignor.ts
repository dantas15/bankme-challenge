import { faker } from './faker-config';
import { payables as mockPayables } from './payable';
import { CreatePayableDto } from '../../modules/payable/dto/create-payable.dto';

export function createAssignor() {
  return {
    document: faker.string.numeric({ length: 11 }),
    email: faker.internet.email(),
    phone: faker.phone.number().replace(/\D/g, ''),
    name: faker.person.fullName(),
  };
}

export function createAssignorWithEmptyPayables() {
  return {
    ...createAssignor(),
    Payables: <CreatePayableDto[]>[],
  };
}

export function createAssignorWithPayables() {
  return {
    ...createAssignor(),
    Payables: mockPayables,
  };
}

export const assignors = faker.helpers.multiple(createAssignor, {
  count: 10,
});
