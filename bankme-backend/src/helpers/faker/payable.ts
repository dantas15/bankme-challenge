import { faker } from './faker-config';

export function createPayable() {
  return {
    value: faker.number.float(),
    emissionDate: faker.date.anytime().toISOString(),
    assignorId: faker.string.uuid(),
  };
}

export function createPayableWithoutAssignorId() {
  return {
    value: faker.number.float(),
    emissionDate: faker.date.anytime().toISOString(),
    assignorId: faker.string.uuid(),
  };
}

export const payables = faker.helpers.multiple(createPayable, {
  count: 10,
});
