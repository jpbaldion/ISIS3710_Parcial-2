import { Injectable } from '@nestjs/common';
import { Resena } from './entities/resena.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actividad } from '../actividad/entities/actividad.entity';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class ResenaService {
  constructor(
    @InjectRepository(Resena)
    private readonly resenaRepository: Repository<Resena>,
    @InjectRepository(Actividad)
    private readonly actividadRepository: Repository<Actividad>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
  ) {}

  async agregarReseña(resena: Resena) {
    const actividad = await this.actividadRepository.findOne({
      where: { id: resena.actividad.id },
    });
    if (!actividad) {
      throw new BusinessLogicException(
        'Actividad no encontrada',
        BusinessError.NOT_FOUND,
      );
    }

    if (actividad.estado !== 2) {
      throw new BusinessLogicException(
        'No se puede agregar reseña a una actividad que no ha sido finalizada',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    const estudiante = await this.estudianteRepository.findOne({
      where: { id: resena.estudiante.id },
      relations: ['actividades'],
    });
    if (!estudiante) {
      throw new BusinessLogicException(
        'Estudiante no encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    if (!estudiante.actividades.some((a) => a.id === actividad.id)) {
      throw new BusinessLogicException(
        'El estudiante no ha participado en esta actividad',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.resenaRepository.save(resena);
  }

  async findResenaById(id: number) {
    return await this.resenaRepository.findOne({
      where: { id },
    });
  }
}
