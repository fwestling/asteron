import { ICollectionsService } from '../collection.service';

export const mockCollectionService: ICollectionsService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByUserId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};
