import { hashSync } from 'bcrypt';
import { faker } from './faker-config';
import { ensureCorrectUserRole } from '../ensureCorrectUserRole';

export function createUser() {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    role: ensureCorrectUserRole('USER'),
  };
}

export function createUserWithIdAndHashedPassword() {
  return {
    id: faker.string.uuid(),
    username: faker.internet.userName(),
    password: hashSync(faker.internet.password(), 10),
    role: ensureCorrectUserRole('USER'),
  };
}

export const users = faker.helpers.multiple(createUserWithIdAndHashedPassword, {
  count: 5,
});
