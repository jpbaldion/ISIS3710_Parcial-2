/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actividad } from '../../actividad/entities/actividad.entity';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { Resena } from '../../resena/entities/resena.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [Estudiante, Actividad, Resena],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([Estudiante, Actividad, Resena]),
];
