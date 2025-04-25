import { redactIfUserHidden, UserRole, FirebaseProvider } from '@second/common';
// import UserRole from 'src/common/user-role';
import { UserDocument } from 'src/modules/users/user.schema';

/** Data about a user, including auth information. */
export default class UserAuthGetDto {
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
  firebaseId?: string;
  providers?: FirebaseProvider[];
  firebaseData?: {
    emailVerified?: boolean;
    picture?: string;
  };
  timestamp: Date;

  constructor(fields: typeof UserAuthGetDto) {
    Object.assign(this, fields);
  }
}

export const toUserAuthGetDto = (user: UserDocument): UserAuthGetDto => ({
  id: user.id.toString(),
  locked: user.locked ?? false,
  deleted: user.deleted ?? false,
  email: redactIfUserHidden(user, user.email),
  phone: redactIfUserHidden(user, user.phone),
  roles: user.roles,
  timestamp: user.timestamp,
  familyName: user.familyName,
  firebaseData: {
    emailVerified: user.emailVerified,
    picture: user.picture,
  },
  firebaseId: user.firebaseId,
  givenName: user.givenName,
  providers: user.providers as FirebaseProvider[],
});
