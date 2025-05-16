import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Actividad } from 'src/actividad/entities/actividad.entity';
import { Estudiante } from 'src/estudiante/entities/estudiante.entity';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Actividad)
    private readonly actividadRepository: Repository<Actividad>,
  ) {}

  async crearEstudiante(estudiante: Estudiante) {
    const estudianteCorreo = estudiante.correo;
    if (!estudianteCorreo.includes('@') && !estudianteCorreo.includes('.')) {
      throw new BusinessLogicException(
        'El correo del estudiante no es válido',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    if (estudiante.semetre < 1 || estudiante.semetre > 10) {
      throw new BusinessLogicException(
        'El semestre del estudiante no es válido',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.estudianteRepository.save(estudiante);
  }

  async findEstudianteById(id: number) {
    return await this.estudianteRepository.findOne({
      where: { id },
    });
  }

  async incribirseActividad(idEstudiante: number, idActividad: number) {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id: idEstudiante },
      relations: ['actividades'],
    });
    if (!estudiante) {
      throw new BusinessLogicException(
        'El estudiante no existe',
        BusinessError.NOT_FOUND,
      );
    }
    const actividad = await this.actividadRepository.findOne({
      where: { id: idActividad },
      relations: ['estudiantes'],
    });
    if (!actividad) {
      throw new BusinessLogicException(
        'La actividad no existe',
        BusinessError.NOT_FOUND,
      );
    }

    if (actividad.estado !== 0) {
      throw new BusinessLogicException(
        'La actividad no esta disponible',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    if (estudiante.actividades.length !== 0) {
      throw new BusinessLogicException(
        'El estudiante no puede tener inscripciones previas',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    estudiante.actividades.push(actividad);
    actividad.estudiantes.push(estudiante);

    await this.estudianteRepository.save(estudiante);
    await this.actividadRepository.save(actividad);

    return estudiante;
  }
}
