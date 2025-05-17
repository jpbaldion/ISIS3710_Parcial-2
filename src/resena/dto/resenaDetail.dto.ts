import { EstudianteDto } from '../../estudiante/dto/estudiante.dto';
import { ResenaDto } from './resena.dto';
import { ActividadDto } from '../../actividad/dto/actividad.dto';

export class ResenaDetailDto extends ResenaDto {
  readonly usuario: EstudianteDto;
  readonly actividad: ActividadDto;
}
