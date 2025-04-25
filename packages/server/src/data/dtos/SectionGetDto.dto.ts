import { SectionDocument } from '~/modules/section/section.schema';

/** Data about a section. */
export default class SectionGetDto {
  id: string;
  name: string;
  colour?: string;
  icon?: string;
  image?: string;
  collections: string[];
  timestamp: Date;

  constructor(fields: typeof SectionGetDto) {
    Object.assign(this, fields);
  }
}

export const toSectionGetDto = (section: SectionDocument): SectionGetDto => ({
  id: section.id.toString(),
  name: section.name,
  colour: section.colour,
  icon: section.icon,
  image: section.image,
  collections: section.collections?.map((collection) => collection.toString()),
  timestamp: section.timestamp,
});
