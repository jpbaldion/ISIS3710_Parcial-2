import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadModule } from './actividad/actividad.module';
import { ResenaModule } from './resena/resena.module';
import { EstudianteModule } from './estudiante/estudiante.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'db',
      entities: [],
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
