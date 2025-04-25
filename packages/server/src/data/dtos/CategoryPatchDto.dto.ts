export default class CategoryPatchDto {
  name?: string;
  colour?: string;
  icon?: string;

  constructor(fields: typeof CategoryPatchDto) {
    Object.assign(this, fields);
  }
}
