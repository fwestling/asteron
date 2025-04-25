export default class ManuscriptCreateDto {
  name: string;
  colour?: string;
  icon?: string;

  constructor(fields: typeof ManuscriptCreateDto) {
    Object.assign(this, fields);
  }
}
