import { Module } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { ActividadController } from './actividad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actividad } from './entities/actividad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Actividad])],
  controllers: [ActividadController],
  providers: [ActividadService],
  exports: [TypeOrmModule],
})
export class ActividadModule {}
