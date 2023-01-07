import { Test, TestingModule } from '@nestjs/testing';
import { MarketplaceController } from './marketplace.controller';

describe('MarketplaceController', () => {
  let controller: MarketplaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketplaceController],
    }).compile();

    controller = module.get<MarketplaceController>(MarketplaceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
