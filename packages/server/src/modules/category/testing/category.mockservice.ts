import { ICategoriesService } from '../category.service';

export const mockCategoryService: ICategoriesService = {
  findById: jest.fn(),
  findByUserId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};
