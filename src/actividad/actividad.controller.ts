import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { ActividadDto } from './dto/actividad.dto';
import { plainToInstance } from 'class-transformer';
import { Actividad } from './entities/actividad.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';

@Controller('actividades')
@UseInterceptors(BusinessErrorsInterceptor)
export class ActividadController {
  constructor(private readonly actividadService: ActividadService) {}

  @Post()
  create(@Body() actividadDto: ActividadDto) {
    const actividad = plainToInstance(Actividad, actividadDto);
    return this.actividadService.crearActividades(actividad);
  }

  @Get()
  findAll(@Query('fecha') fecha: string) {
    return this.actividadService.findActividadesByFecha(fecha);
  }

  @Put(':id')
  update(@Param('id') id: string, @Query('estado') estado: number) {
    return this.actividadService.cambiarEstado(+id, +estado);
  }
}
