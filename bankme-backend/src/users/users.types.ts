const ROLES = ['ADMIN', 'USER'] as const;
export type Role = (typeof ROLES)[number];

export type User = {
  name: string;
  password: string;
  role: Role;
};
