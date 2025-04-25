import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { mockUserService } from '~/modules/users/testing/user.mockservice';
import { AppConfigurationService } from '~/configuration/app-configuration.service';
import { mockConfigService } from '~/configuration/app-configuration.mockservice';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers:
        [
          {
            provide: AppConfigurationService,
            useValue: mockConfigService,
          },
          {
            provide: UsersService,
            useValue: mockUserService,
          },
        ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
