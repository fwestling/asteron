import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { mockAuthService } from '~/modules/auth/testing/auth.mockservice';
import { UsersService } from '~/modules/users/users.service';
import { mockUserService } from '~/modules/users/testing/user.mockservice';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
