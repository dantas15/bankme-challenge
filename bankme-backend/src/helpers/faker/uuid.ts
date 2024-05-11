import { faker } from './faker-config';

export function generateUuid() {
  return faker.string.uuid();
}
