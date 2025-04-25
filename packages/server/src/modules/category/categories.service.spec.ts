import { Test, TestingModule } from '@nestjs/testing';
import { mockConfigService } from '~/configuration/app-configuration.mockservice';
import { AppConfigurationService } from '~/configuration/app-configuration.service';
import { CategoriesService } from './category.service';
import { mockCategoryService } from './testing/category.mockservice';
describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AppConfigurationService,
          useValue: mockConfigService,
        },
        {
          provide: CategoriesService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
