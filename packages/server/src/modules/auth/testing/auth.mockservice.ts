import { IAuthService } from '../auth.service';

export const mockAuthService: IAuthService = {
  validateUser: jest.fn(),
};
