export default class UserPatchDto {
  givenName?: string;
  familyName?: string;
  phone?: string;

  constructor(fields: typeof UserPatchDto) {
    Object.assign(this, fields);
  }
}
