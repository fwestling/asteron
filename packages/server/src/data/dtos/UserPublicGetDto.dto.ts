import { UserDocument } from '~/modules/users/user.schema';

/** Data about a user. */
export default class UserPublicGetDto {
  id: string;
  locked: boolean;
  deleted: boolean;
  email: string;
  familyName?: string;
  givenName?: string;
  avatar?: string;

  constructor(fields: typeof UserPublicGetDto) {
    Object.assign(this, fields);
  }
}

export const toUserPublicGetDto = (user: UserDocument): UserPublicGetDto => ({
  id: String(user._id),
  email: user.email,
  avatar: user.picture,
  locked: user.locked ?? false,
  deleted: user.deleted ?? false,
  familyName: user.familyName,
  givenName: user.givenName,
});
