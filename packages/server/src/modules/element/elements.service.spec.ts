import { Test, TestingModule } from '@nestjs/testing';
import { mockElementService } from '~/modules/element/testing/element.mockservice';
import { AppConfigurationService } from '~/configuration/app-configuration.service';
import { mockConfigService } from '~/configuration/app-configuration.mockservice';
import { ElementsService } from './element.service';

describe('ElementsService', () => {
  let service: ElementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AppConfigurationService,
          useValue: mockConfigService,
        },
        {
          provide: ElementsService,
          useValue: mockElementService,
        },
      ],
    }).compile();

    service = module.get<ElementsService>(ElementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
