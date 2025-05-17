import { Test, TestingModule } from '@nestjs/testing';
import { ActividadService } from './actividad.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Actividad } from './entities/actividad.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { faker } from '@faker-js/faker';
import { Estudiante } from '../estudiante/entities/estudiante.entity';

describe('ActividadService', () => {
  let service: ActividadService;
  let actividadRepository: Repository<Actividad>;
  let estudianteRepository: Repository<Estudiante>;
  let actividadList: Actividad[];
  let estudianteList: Estudiante[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ActividadService],
    }).compile();

    service = module.get<ActividadService>(ActividadService);
    actividadRepository = module.get<Repository<Actividad>>(
      getRepositoryToken(Actividad),
    );
    estudianteRepository = module.get<Repository<Estudiante>>(
      getRepositoryToken(Estudiante),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await actividadRepository.clear();
    actividadList = [];
    estudianteList = [];

    for (let i = 0; i < 5; i++) {
      const estudiante: Estudiante = await estudianteRepository.save({
        nombre: faker.person.firstName(),
        cedula: faker.number.int({ min: 10000000, max: 99999999 }),
        programa: faker.person.jobArea(),
        semestre: faker.number.int({ min: 1, max: 10 }),
        correo: faker.internet.email(),
      });
      estudianteList.push(estudiante);
    }

    for (let i = 0; i < 3; i++) {
      const actividad: Actividad = await actividadRepository.save({
        titulo: faker.lorem.sentence(),
        fecha: faker.date.past().toString(),
        cupoMaximo: 3,
        estado: i,
        estudiantes: [estudianteList[0], estudianteList[1]],
      });
      actividadList.push(actividad);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deberia crear una actividad', async () => {
    const actividad: Actividad = {
      id: 0,
      titulo: faker.lorem.sentence(),
      fecha: faker.date.past().toString(),
      cupoMaximo: faker.number.int({ min: 1, max: 100 }),
      estado: 0,
      resenas: [],
      estudiantes: [],
    };

    const nuevaActividad = await service.crearActividades(actividad);
    expect(nuevaActividad).not.toBeNull();
    expect(nuevaActividad.titulo).toEqual(actividad.titulo);
    expect(nuevaActividad.fecha).toEqual(actividad.fecha);
    expect(nuevaActividad.cupoMaximo).toEqual(actividad.cupoMaximo);
    expect(nuevaActividad.estado).toEqual(actividad.estado);
  });

  it('deberia lanzar una excepcion por titulo menor a 15 caracteres', async () => {
    const actividad: Actividad = {
      id: 0,
      titulo: 'titulo',
      fecha: faker.date.past().toString(),
      cupoMaximo: faker.number.int({ min: 1, max: 100 }),
      estado: 0,
      resenas: [],
      estudiantes: [],
    };
    await expect(() =>
      service.crearActividades(actividad),
    ).rejects.toHaveProperty('message', 'Caracteres minimos 15 para el titulo');
  });

  it('deberia lanzar una excepcion por titulo con simbolos', async () => {
    const actividad: Actividad = {
      id: 0,
      titulo: 'titulolargodemasde15caracteres@',
      fecha: faker.date.past().toString(),
      cupoMaximo: faker.number.int({ min: 1, max: 100 }),
      estado: 0,
      resenas: [],
      estudiantes: [],
    };
    await expect(() =>
      service.crearActividades(actividad),
    ).rejects.toHaveProperty('message', 'El titulo no puede contener simbolos');
  });

  it('deberia cambiar el estado de una actividad', async () => {
    const actividad: Actividad = actividadList[0];
    actividad.estado = 1;
    const nuevaActividad = await service.cambiarEstado(
      actividad.id,
      actividad.estado,
    );

    expect(nuevaActividad).not.toBeNull();
    expect(nuevaActividad.estado).toEqual(actividad.estado);
  });

  it('deberia lanzar una excepcion por se intenta finalizar una actividad con cupo', async () => {
    const actividad: Actividad = actividadList[0];
    actividad.estado = 2;
    await expect(() =>
      service.cambiarEstado(actividad.id, actividad.estado),
    ).rejects.toHaveProperty(
      'message',
      'No puede poner este estado a una actividad con cupo',
    );
  });

  it('deberia encontrar todas las actividades por fecha', async () => {
    const fecha = actividadList[0].fecha;
    const actividades = await service.findActividadesByFecha(fecha);
    expect(actividades).not.toBeNull();
    expect(actividades.length).toEqual(1);
    expect(actividades[0].fecha).toEqual(fecha);
  });

  it('deberia lanzar una excepcion por no encontrar actividades por fecha', async () => {
    const fecha = '0000-00-00';
    await expect(() =>
      service.findActividadesByFecha(fecha),
    ).rejects.toHaveProperty(
      'message',
      'No hay actividades para la fecha proporcionada',
    );
  });
});
