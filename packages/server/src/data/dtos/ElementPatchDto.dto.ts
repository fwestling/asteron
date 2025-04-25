export default class ElementPatchDto {
  name?: string;
  colour?: string;
  icon?: string;

  constructor(fields: typeof ElementPatchDto) {
    Object.assign(this, fields);
  }
}
