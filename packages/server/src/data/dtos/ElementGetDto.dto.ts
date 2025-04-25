import { ElementDocument } from '~/modules/element/element.schema';

export interface ElementFormatGetDto {
  label: string;
  value: string;
}

export interface ElementNameGetDto {
  index: number;
  formats: ElementFormatGetDto[];
}

/** Data about a element. */
export default class ElementGetDto {
  id: string;
  defaultName: string;
  names: ElementNameGetDto[];
  colour: string;
  image: string;
  collections: string[];
  timestamp: Date;

  constructor(fields: typeof ElementGetDto) {
    Object.assign(this, fields);
  }
}

export const toElementGetDto = (element: ElementDocument): ElementGetDto => ({
  id: element.id.toString(),
  defaultName: element.defaultName ?? element.names[0].formats[0].value,
  names: element.names.map((name) => ({
    index: name.index,
    formats: name.formats.map((format) => ({
      label: format.label,
      value: format.value,
    })),
  })),
  colour: element.colour,
  image: element.image,
  collections: element.collections?.map((collection) => collection.toString()),
  timestamp: element.timestamp,
});
