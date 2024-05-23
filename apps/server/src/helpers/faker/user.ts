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
  const unhashedPassword = faker.internet.password();
  return {
    id: faker.string.uuid(),
    username: faker.internet.userName(),
    unhashedPassword,
    password: hashSync(unhashedPassword, 10),
    role: ensureCorrectUserRole('USER'),
  };
}

export const users = faker.helpers.multiple(createUserWithIdAndHashedPassword, {
  count: 5,
});
