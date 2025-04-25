import { UserRole, UserRoles } from '@second/common';
import { Request } from 'express';

/** Returns true if user has any of the given roles */
export const userHasAnyRole = (
  user: Request['user'],
  roles: UserRole[],
): boolean =>
  roles
    .map((role) => user.roles.includes(role))
    .reduce((p, c) => c || p, false);

export const userIsElevated = (user: Request['user']) =>
  userHasAnyRole(user, [
    UserRoles.Admin,
    // Add more here?
  ]);

export const userIsAdmin = (user: Request['user']) =>
  user.roles.includes(UserRoles.Admin);
