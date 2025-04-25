export default class UserUpdateDto {
  locked?: boolean;
  deleted?: boolean;
  givenName?: string;
  familyName?: string;
  phone?: string;
  credit?: number;
  creditDescription?: string;
  picture?: string;

  constructor(fields: typeof UserUpdateDto) {
    Object.assign(this, fields);
  }
}
