import { Test, TestingModule } from '@nestjs/testing';
import { mockConfigService } from '~/configuration/app-configuration.mockservice';
import { AppConfigurationService } from '~/configuration/app-configuration.service';
import { ElementsController } from './elements.controller';
import { ElementsService } from './element.service';
import { mockElementService } from './testing/element.mockservice';

describe('ElementsController', () => {
  let controller: ElementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ElementsService,
          useValue: mockElementService,
        },
        {
          provide: AppConfigurationService,
          useValue: mockConfigService,
        },
      ],
      controllers: [ElementsController],
    }).compile();

    controller = module.get<ElementsController>(ElementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
