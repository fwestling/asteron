export default class ManuscriptPatchDto {
  name?: string;
  colour?: string;
  icon?: string;

  constructor(fields: typeof ManuscriptPatchDto) {
    Object.assign(this, fields);
  }
}
