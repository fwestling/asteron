import { ManuscriptDocument } from '~/modules/manuscript/manuscript.schema';

/** Data about a manuscript. */
export default class ManuscriptGetDto {
  id: string;
  name: string;
  colour?: string;
  icon?: string;
  image?: string;
  collections: string[];
  timestamp: Date;

  constructor(fields: typeof ManuscriptGetDto) {
    Object.assign(this, fields);
  }
}

export const toManuscriptGetDto = (
  manuscript: ManuscriptDocument,
): ManuscriptGetDto => ({
  id: manuscript.id.toString(),
  name: manuscript.name,
  colour: manuscript.colour,
  icon: manuscript.icon,
  image: manuscript.image,
  collections: manuscript.collections?.map((collection) =>
    collection.toString(),
  ),
  timestamp: manuscript.timestamp,
});
