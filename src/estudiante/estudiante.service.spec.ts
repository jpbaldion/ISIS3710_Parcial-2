import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteService } from './estudiante.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('EstudianteService', () => {
  let service: EstudianteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstudianteService],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
