export default class SectionPatchDto {
  name?: string;
  colour?: string;
  icon?: string;

  constructor(fields: typeof SectionPatchDto) {
    Object.assign(this, fields);
  }
}
