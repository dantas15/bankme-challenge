import { faker } from './faker-config';

export function createAssignorDto() {
  return {
    id: faker.string.uuid(),
    document: faker.string.numeric({ length: 11 }),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    name: faker.person.fullName(),
  };
}

export const assignors = faker.helpers.multiple(createAssignorDto, {
  count: 10,
});
