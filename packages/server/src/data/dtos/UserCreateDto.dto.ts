import { FirebaseProvider, UserRole } from '@second/common';

export default class UserCreateDto {
  email: string;
  givenName?: string;
  familyName?: string;
  phone?: string;
  roles: UserRole[];
  firebaseId?: string;
  providers?: FirebaseProvider[];
  picture?: string;
  emailVerified?: boolean;
  firebaseData?: {
    emailVerified?: boolean;
    picture?: string;
  };
  constructor(fields: typeof UserCreateDto) {
    Object.assign(this, fields);
  }
}
