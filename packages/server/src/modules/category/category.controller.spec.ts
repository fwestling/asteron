import { Test, TestingModule } from '@nestjs/testing';
import { mockConfigService } from '~/configuration/app-configuration.mockservice';
import { AppConfigurationService } from '~/configuration/app-configuration.service';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './category.service';
import { mockCategoryService } from './testing/category.mockservice';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoryService,
        },
        {
          provide: AppConfigurationService,
          useValue: mockConfigService,
        },
      ],
      controllers: [CategoriesController],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
