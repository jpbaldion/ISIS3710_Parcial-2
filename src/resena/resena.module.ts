import { Module } from '@nestjs/common';
import { ResenaService } from './resena.service';
import { ResenaController } from './resena.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resena } from './entities/resena.entity';
import { EstudianteModule } from 'src/estudiante/estudiante.module';
import { ActividadModule } from 'src/actividad/actividad.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resena]),
    EstudianteModule,
    ActividadModule,
  ],
  controllers: [ResenaController],
  providers: [ResenaService],
})
export class ResenaModule {}
