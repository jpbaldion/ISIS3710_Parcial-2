import { Test, TestingModule } from '@nestjs/testing';
import { ResenaService } from './resena.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('ResenaService', () => {
  let service: ResenaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ResenaService],
    }).compile();

    service = module.get<ResenaService>(ResenaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
