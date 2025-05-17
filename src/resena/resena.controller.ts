import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ResenaService } from './resena.service';
import { ResenaDetailDto } from './dto/resenaDetail.dto';
import { plainToInstance } from 'class-transformer';
import { Resena } from './entities/resena.entity';

@Controller('resena')
export class ResenaController {
  constructor(private readonly resenaService: ResenaService) {}

  @Post()
  create(@Body() createResenaDto: ResenaDetailDto) {
    const resena = plainToInstance(Resena, createResenaDto);
    return this.resenaService.agregarReseña(resena);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resenaService.findResenaById(+id);
  }
}
