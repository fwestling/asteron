import { IUsersService } from '../users.service';

export const mockUserService: IUsersService = {
  findAll: jest.fn(),
  findAllDeleted: jest.fn(),
  findAllLocked: jest.fn(),
  findById: jest.fn(),
  findByIdDeleted: jest.fn(),
  findByIds: jest.fn(),
  findByIdLean: jest.fn(),
  findOneByFirebaseId: jest.fn(),
  findOneByEmail: jest.fn(),
  findAllPopulated: jest.fn(),
  findByIdPopulated: jest.fn(),
  findByIdDeletedPopulated: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  addRole: jest.fn(),
  removeRole: jest.fn(),
  addFirebase: jest.fn(),
  addFirebaseProvider: jest.fn(),
};
