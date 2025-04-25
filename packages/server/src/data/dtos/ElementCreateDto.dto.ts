export default class ElementCreateDto {
  name: string;
  colour?: string;
  icon?: string;

  constructor(fields: typeof ElementCreateDto) {
    Object.assign(this, fields);
  }
}
