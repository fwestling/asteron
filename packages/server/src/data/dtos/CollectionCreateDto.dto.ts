export default class CollectionCreateDto {
  name: string;
  colour?: string;
  icon?: string;

  constructor(fields: typeof CollectionCreateDto) {
    Object.assign(this, fields);
  }
}
