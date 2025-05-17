import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ResenaDto {
  @IsString()
  @IsNotEmpty()
  readonly comentario: string;

  @IsInt()
  @IsNotEmpty()
  readonly calificacion: number;

  @IsString()
  @IsNotEmpty()
  readonly fecha: string;
}
