import { faker } from './faker-config';

export function createAssignor() {
  return {
    id: faker.string.uuid(),
    document: faker.string.numeric({ length: 11 }),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    name: faker.person.fullName(),
  };
}

export const assignors = faker.helpers.multiple(createAssignor, {
  count: 10,
});
