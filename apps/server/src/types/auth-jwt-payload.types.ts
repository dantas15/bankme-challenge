import { Role } from './roles.types';

export type JwtPayload = {
  username: string;
  userId: string;
  role: Role;
};
