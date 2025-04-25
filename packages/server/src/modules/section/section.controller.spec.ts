import { Test, TestingModule } from '@nestjs/testing';
import { mockConfigService } from '~/configuration/app-configuration.mockservice';
import { AppConfigurationService } from '~/configuration/app-configuration.service';
import { SectionsService } from './section.service';
import { SectionsController } from './sections.controller';
import { mockSectionService } from './testing/section.mockservice';

describe('SectionsController', () => {
  let controller: SectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SectionsService,
          useValue: mockSectionService,
        },
        {
          provide: AppConfigurationService,
          useValue: mockConfigService,
        },
      ],
      controllers: [SectionsController],
    }).compile();

    controller = module.get<SectionsController>(SectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
