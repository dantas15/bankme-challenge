import { Role } from './roles.types';

export type User = {
  name: string;
  password: string;
  role: Role;
};
