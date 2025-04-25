import { redactIfUserHidden, UserRole } from '@second/common';
import { UserDocument } from 'src/modules/users/user.schema';

/** Data about a user. */
export default class UserGetDto {
  id: string;
  locked: boolean;
  deleted: boolean;
  givenName?: string;
  familyName?: string;
  email: string;
  phone?: string;
  /** User roles
   * @enum roles type of UserRole
   */
  roles: UserRole[];
  teamLimit?: number;
  credit?: number;
  creditDescription?: string;
  emailVerified?: boolean;
  timestamp: Date;

  constructor(fields: typeof UserGetDto) {
    Object.assign(this, fields);
  }
}

export const toUserGetDto = (user: UserDocument): UserGetDto => ({
  id: user.id.toString(),
  locked: user.locked ?? false,
  deleted: user.deleted ?? false,
  email: redactIfUserHidden(user, user.email),
  phone: redactIfUserHidden(user, user.phone),
  roles: user.roles,
  timestamp: user.timestamp,
  familyName: user.familyName,
  givenName: user.givenName,
  emailVerified: user.emailVerified,
});
