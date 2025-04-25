import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigurationService } from '~/configuration/app-configuration.service';
import { mockConfigService } from '~/configuration/app-configuration.mockservice';
import { CollectionsService } from './collection.service';
import { mockCollectionService } from './testing/collection.mockservice';
describe('CollectionsService', () => {
  let service: CollectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AppConfigurationService,
          useValue: mockConfigService,
        },
        {
          provide: CollectionsService,
          useValue: mockCollectionService,
        },
      ],
    }).compile();

    service = module.get<CollectionsService>(CollectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
