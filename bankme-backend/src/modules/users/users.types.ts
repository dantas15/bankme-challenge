import { Role } from './roles.types';

export type User = {
  username: string;
  password: string;
  role: Role;
};
