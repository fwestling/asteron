import { IManuscriptsService } from '../manuscript.service';

export const mockManuscriptService: IManuscriptsService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByUserId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};
