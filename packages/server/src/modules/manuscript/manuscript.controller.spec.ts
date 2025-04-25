import { Test, TestingModule } from '@nestjs/testing';
import { mockConfigService } from '~/configuration/app-configuration.mockservice';
import { AppConfigurationService } from '~/configuration/app-configuration.service';
import { ManuscriptsController } from './manuscripts.controller';
import { ManuscriptsService } from './manuscript.service';
import { mockManuscriptService } from './testing/manuscript.mockservice';

describe('ManuscriptsController', () => {
  let controller: ManuscriptsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ManuscriptsService,
          useValue: mockManuscriptService,
        },
        {
          provide: AppConfigurationService,
          useValue: mockConfigService,
        },
      ],
      controllers: [ManuscriptsController],
    }).compile();

    controller = module.get<ManuscriptsController>(ManuscriptsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
