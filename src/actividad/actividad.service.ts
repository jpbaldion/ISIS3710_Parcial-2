import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { Actividad } from './entities/actividad.entity';

@Injectable()
export class ActividadService {
  constructor(
    @InjectRepository(Actividad)
    private readonly actividadRepository: Repository<Actividad>,
  ) {}

  async crearActividades(actividad: Actividad) {
    const simbolos = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];
    if (actividad.titulo.length < 15) {
      throw new BusinessLogicException(
        'Caracteres minimos 15 para el titulo',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    for (const simbolo of simbolos) {
      if (actividad.titulo.includes(simbolo)) {
        throw new BusinessLogicException(
          'El titulo no puede contener simbolos',
          BusinessError.PRECONDITION_FAILED,
        );
      }
    }
    return await this.actividadRepository.save(actividad);
  }

  async cambiarEstado(id: number, estado: number) {
    if (!(estado === 1 || estado === 2 || estado === 0)) {
      throw new BusinessLogicException(
        'Estado invalido',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    const actividad = await this.actividadRepository.findOne({
      where: { id },
      relations: ['estudiantes'],
    });

    if (!actividad) {
      throw new BusinessLogicException(
        'Actividad no encontrada',
        BusinessError.NOT_FOUND,
      );
    }

    if (estado === 1) {
      if (
        actividad.estudiantes.length < Math.floor(actividad.cupoMaximo * 0.8)
      ) {
        throw new BusinessLogicException(
          'No puede poner este estado a una actividad con cupo menor al 80%',
          BusinessError.PRECONDITION_FAILED,
        );
      }
    } else if (estado === 2) {
      if (actividad.estudiantes.length !== actividad.cupoMaximo) {
        throw new BusinessLogicException(
          'No puede poner este estado a una actividad con cupo',
          BusinessError.PRECONDITION_FAILED,
        );
      }
    }
    actividad.estado = estado;
    return await this.actividadRepository.save(actividad);
  }

  async findActividadesByFecha(fecha: string) {
    const actividades = await this.actividadRepository.find({
      where: { fecha },
    });

    if (actividades.length === 0) {
      throw new BusinessLogicException(
        'No hay actividades para la fecha proporcionada',
        BusinessError.NOT_FOUND,
      );
    }
    return actividades;
  }
}
