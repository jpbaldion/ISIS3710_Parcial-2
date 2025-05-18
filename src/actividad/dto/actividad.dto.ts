import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EstudianteDto } from '../../estudiante/dto/estudiante.dto';

export class ActividadDto {
  @IsInt()
  @IsOptional()
  readonly id: number;

  @IsString()
  @IsNotEmpty()
  readonly titulo: string;

  @IsString()
  @IsNotEmpty()
  readonly fecha: string;

  @IsInt()
  @IsNotEmpty()
  readonly cupoMaximo: number;

  @IsInt()
  @IsNotEmpty()
  readonly estado: number;

  readonly estudiante: EstudianteDto;
}
