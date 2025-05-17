import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { EstudianteDto } from './dto/estudiante.dto';
import { Estudiante } from './entities/estudiante.entity';
import { plainToInstance } from 'class-transformer';

@Controller('estudiantes')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post()
  async create(@Body() estudianteDto: EstudianteDto) {
    const estudiante: Estudiante = plainToInstance(Estudiante, estudianteDto);
    return await this.estudianteService.crearEstudiante(estudiante);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estudianteService.findEstudianteById(+id);
  }

  @Post(':idEstudiante/actividades/:idActividad')
  async incribirseActividad(
    @Param('idEstudiante') idEstudiante: string,
    @Param('idActividad') idActividad: string,
  ) {
    return await this.estudianteService.incribirseActividad(
      +idEstudiante,
      +idActividad,
    );
  }
}
