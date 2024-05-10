import { faker } from './faker-config';

export function createAssignor() {
  return {
    document: faker.string.numeric({ length: 11 }),
    email: faker.internet.email(),
    phone: faker.phone.number().replace(/\D/g, ''),
    name: faker.person.fullName(),
  };
}

export const assignors = faker.helpers.multiple(createAssignor, {
  count: 10,
});
