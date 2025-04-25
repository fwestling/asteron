import { Test, TestingModule } from '@nestjs/testing';
import { mockManuscriptService } from '~/modules/manuscript/testing/manuscript.mockservice';
import { AppConfigurationService } from '~/configuration/app-configuration.service';
import { mockConfigService } from '~/configuration/app-configuration.mockservice';
import { ManuscriptsService } from './manuscript.service';

describe('ManuscriptsService', () => {
  let service: ManuscriptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AppConfigurationService,
          useValue: mockConfigService,
        },
        {
          provide: ManuscriptsService,
          useValue: mockManuscriptService,
        },
      ],
    }).compile();

    service = module.get<ManuscriptsService>(ManuscriptsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
