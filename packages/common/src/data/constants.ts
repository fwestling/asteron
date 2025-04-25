export const MIN_REF_ID = 240000;
export const LOCALE = "AU";

export const FirebaseProviders = ['google.com', 'password'] as const;

export const UserRoles = {
  User: "User",
  Admin: "Admin",
} as const;

export const UserRolesArray: typeof UserRoles[keyof typeof UserRoles][] = [
  UserRoles.Admin,
  UserRoles.User,
];

export const Roles = UserRoles;
