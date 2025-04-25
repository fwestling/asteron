export default class SectionCreateDto {
  name: string;
  colour?: string;
  icon?: string;

  constructor(fields: typeof SectionCreateDto) {
    Object.assign(this, fields);
  }
}
