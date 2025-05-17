import { IsEmail, IsString, IsInt } from 'class-validator';

export class EstudianteDto {
  @IsString()
  readonly nombre: string;
  @IsInt()
  readonly cedula: number;
  @IsEmail()
  readonly correo: string;
  @IsString()
  readonly programa: string;
  @IsInt()
  readonly semestre: number;
}
