import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadModule } from './actividad/actividad.module';
import { ResenaModule } from './resena/resena.module';
import { EstudianteModule } from './estudiante/estudiante.module';
import { Actividad } from './actividad/entities/actividad.entity';
import { Estudiante } from './estudiante/entities/estudiante.entity';
import { Resena } from './resena/entities/resena.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'db',
      entities: [Actividad, Estudiante, Resena],
      dropSchema: true,
      synchronize: true,
    }),
    ActividadModule,
    ResenaModule,
    EstudianteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
