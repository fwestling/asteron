import { CollectionDocument } from '~/modules/collection/collection.schema';

/** Data about a collection. */
export default class CollectionGetDto {
  id: string;
  name: string;
  colour: string;
  icon: string;
  parentId?: string;
  timestamp: Date;

  constructor(fields: typeof CollectionGetDto) {
    Object.assign(this, fields);
  }
}

export const toCollectionGetDto = (
  collection: CollectionDocument,
): CollectionGetDto => ({
  id: collection.id.toString(),
  name: collection.name,
  colour: collection.colour,
  icon: collection.icon,
  parentId: collection.parent.toString(),
  timestamp: collection.timestamp,
});
