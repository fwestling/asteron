export default class UserPatchVisibilityDto {
  locked?: boolean;
  deleted?: boolean;

  constructor(fields: typeof UserPatchVisibilityDto) {
    Object.assign(this, fields);
  }
}
