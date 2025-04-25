import { ObjectId } from 'mongoose';
import { CategoryDocument } from '~/modules/category/category.schema';

/** Data about a category. */
export default class CategoryGetDto {
  id: string;
  name: string;
  colour: string;
  icon: string;

  constructor(fields: typeof CategoryGetDto) {
    Object.assign(this, fields);
  }
}

export const toCategoryGetDto = (
  category: CategoryDocument,
): CategoryGetDto => ({
  id: (category._id as ObjectId)?.toString(),
  name: category.name,
  colour: category.colour,
  icon: category.icon,
});
