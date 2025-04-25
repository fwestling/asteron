import { Test, TestingModule } from '@nestjs/testing';
import { mockConfigService } from '~/configuration/app-configuration.mockservice';
import { AppConfigurationService } from '~/configuration/app-configuration.service';
import { CollectionsService } from './collection.service';
import { CollectionsController } from './collections.controller';
import { mockCollectionService } from './testing/collection.mockservice';

describe('CollectionsController', () => {
  let controller: CollectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CollectionsService,
          useValue: mockCollectionService,
        },
        {
          provide: AppConfigurationService,
          useValue: mockConfigService,
        },
      ],
      controllers: [CollectionsController],
    }).compile();

    controller = module.get<CollectionsController>(CollectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
