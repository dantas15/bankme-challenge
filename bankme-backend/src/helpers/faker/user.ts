import { faker } from './faker-config';
import * as bcrypt from 'bcrypt';

export function createUser() {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(),
  };
}

export function createUserWithIdAndHashedPassword() {
  return {
    id: faker.string.uuid(),
    username: faker.internet.userName(),
    password: bcrypt.hashSync(faker.internet.password(), 10),
  };
}

export const users = faker.helpers.multiple(createUserWithIdAndHashedPassword, {
  count: 5,
});
