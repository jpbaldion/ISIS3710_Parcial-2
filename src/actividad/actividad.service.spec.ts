import { Test, TestingModule } from '@nestjs/testing';
import { ActividadService } from './actividad.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('ActividadService', () => {
  let service: ActividadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ActividadService],
    }).compile();

    service = module.get<ActividadService>(ActividadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
