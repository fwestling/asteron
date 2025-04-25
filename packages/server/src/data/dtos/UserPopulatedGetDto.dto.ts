import { UserRole } from '@second/common';
import { redactIfUserHidden } from '@second/common';
import { UserDocument } from 'src/modules/users/user.schema';

/** Data of one user including a breakdown of their finances */
export default class UserPopulatedGetDto {
  id: string;
  locked: boolean;
  deleted: boolean;
  givenName?: string;
  familyName?: string;
  email: string;
  /**
   * User roles
   */
  roles: Array<UserRole>;
  teamLimit?: number;
  timestamp: Date;
  phone: string;

  constructor(fields: typeof UserPopulatedGetDto) {
    Object.assign(this, fields);
  }
}

export const toUserPopulatedGetDto = (
  doc: UserDocument,
): UserPopulatedGetDto => {
  const dto: UserPopulatedGetDto = {
    id: doc.id.toString(),
    locked: doc.locked ?? false,
    deleted: doc.deleted ?? false,
    email: redactIfUserHidden(doc, doc.email),
    phone: redactIfUserHidden(doc, doc.phone),
    roles: doc.roles,
    timestamp: doc.timestamp,
    givenName: doc.givenName,
    familyName: doc.familyName,
  };
  return dto;
};
