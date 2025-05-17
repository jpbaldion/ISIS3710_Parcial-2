import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { EstudianteController } from './estudiante.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { ActividadModule } from 'src/actividad/actividad.module';

@Module({
  imports: [TypeOrmModule.forFeature([Estudiante]), ActividadModule],
  controllers: [EstudianteController],
  providers: [EstudianteService],
  exports: [TypeOrmModule],
})
export class EstudianteModule {}
