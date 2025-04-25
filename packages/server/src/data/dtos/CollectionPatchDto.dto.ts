export default class CollectionPatchDto {
  name?: string;
  colour?: string;
  icon?: string;

  constructor(fields: typeof CollectionPatchDto) {
    Object.assign(this, fields);
  }
}
