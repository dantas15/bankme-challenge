import { ROLES, Role } from '../types/roles.types';

export function ensureCorrectUserRole(roleToBeVerified: string): Role {
  const correctRole = ROLES.find((r) => r === (roleToBeVerified as Role));

  if (!correctRole) {
    return 'USER';
  }

  return correctRole;
}
