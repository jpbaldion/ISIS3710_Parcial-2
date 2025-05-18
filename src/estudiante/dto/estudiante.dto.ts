import { IsEmail, IsString, IsInt, IsOptional } from 'class-validator';

export class EstudianteDto {
  @IsInt()
  @IsOptional()
  readonly id: number;
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
