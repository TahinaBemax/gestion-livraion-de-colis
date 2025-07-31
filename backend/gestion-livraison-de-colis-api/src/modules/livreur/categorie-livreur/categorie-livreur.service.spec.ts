import { Test, TestingModule } from '@nestjs/testing';
import { CategorieLivreurService } from './categorie-livreur.service';

describe('CategorieLivreurService', () => {
  let service: CategorieLivreurService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategorieLivreurService],
    }).compile();

    service = module.get<CategorieLivreurService>(CategorieLivreurService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
