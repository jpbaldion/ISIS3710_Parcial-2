/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteService } from './estudiante.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Actividad } from '../actividad/entities/actividad.entity';
import { Estudiante } from './entities/estudiante.entity';

import { faker } from '@faker-js/faker';

describe('EstudianteService', () => {
  let service: EstudianteService;
  let actividadRepository: Repository<Actividad>;
  let estudiantesRepository: Repository<Estudiante>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let actividad: Actividad;
  let estudianteList: Estudiante[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstudianteService],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    actividadRepository = module.get<Repository<Actividad>>(
      getRepositoryToken(Actividad),
    );
    estudiantesRepository = module.get<Repository<Estudiante>>(
      getRepositoryToken(Estudiante),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    estudiantesRepository.clear();
    estudianteList = [];

    for (let i = 0; i < 5; i++) {
      const estudiante: Estudiante = await estudiantesRepository.save({
        nombre: faker.person.firstName(),
        cedula: faker.number.int({ min: 10000000, max: 99999999 }),
        programa: faker.person.jobArea(),
        semestre: faker.number.int({ min: 1, max: 10 }),
        correo: faker.internet.email(),
      });
      estudianteList.push(estudiante);
    }
    actividad = await actividadRepository.save({
      titulo: faker.lorem.sentence(),
      fecha: faker.date.past().toString(),
      cupoMaximo: faker.number.int({ min: 1, max: 100 }),
      estado: faker.number.int({ min: 0, max: 3 }),
    });
  };
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deberia crear un estudiante', async () => {
    const estudiante: Estudiante = {
      id: 0,
      nombre: faker.person.firstName(),
      cedula: faker.number.int({ min: 10000000, max: 99999999 }),
      programa: faker.person.jobArea(),
      semestre: faker.number.int({ min: 1, max: 10 }),
      correo: faker.internet.email(),
      resenas: [],
      actividades: [],
    };

    const newEstudiante = await service.crearEstudiante(estudiante);
    expect(newEstudiante).not.toBeNull();
    expect(newEstudiante.nombre).toEqual(estudiante.nombre);
    expect(newEstudiante.cedula).toEqual(estudiante.cedula);
    expect(newEstudiante.programa).toEqual(estudiante.programa);
    expect(newEstudiante.semestre).toEqual(estudiante.semestre);
    expect(newEstudiante.correo).toEqual(estudiante.correo);
  });

  it('deberia lanzar una excepcion por correo invalido', async () => {
    const estudiante: Estudiante = {
      id: 0,
      nombre: faker.person.firstName(),
      cedula: faker.number.int({ min: 10000000, max: 99999999 }),
      programa: faker.person.jobArea(),
      semestre: faker.number.int({ min: 1, max: 10 }),
      correo: 'correo-invalido',
      resenas: [],
      actividades: [],
    };

    await expect(() =>
      service.crearEstudiante(estudiante),
    ).rejects.toHaveProperty(
      'message',
      'El correo del estudiante no es válido',
    );
  });

  it('deberia lanzar una excepcion por semestre invalido', async () => {
    const estudiante: Estudiante = {
      id: 0,
      nombre: faker.person.firstName(),
      cedula: faker.number.int({ min: 10000000, max: 99999999 }),
      programa: faker.person.jobArea(),
      semestre: 11,
      correo: faker.internet.email(),
      resenas: [],
      actividades: [],
    };

    await expect(() =>
      service.crearEstudiante(estudiante),
    ).rejects.toHaveProperty(
      'message',
      'El semestre del estudiante no es válido',
    );
  });

  it('deberia obtener un estudiante por id', async () => {
    const estudiante: Estudiante = estudianteList[0];
    const foundEstudiante: Estudiante | null = await service.findEstudianteById(
      estudiante.id,
    );
    expect(foundEstudiante).not.toBeNull();
    expect(foundEstudiante.nombre).toEqual(estudiante.nombre);
    expect(foundEstudiante.cedula).toEqual(estudiante.cedula);
    expect(foundEstudiante.programa).toEqual(estudiante.programa);
    expect(foundEstudiante.semestre).toEqual(estudiante.semestre);
    expect(foundEstudiante.correo).toEqual(estudiante.correo);
  });

  it('deberia lanzar una excepcion por estudiante no encontrado', async () => {
    await expect(() => service.findEstudianteById(0)).rejects.toHaveProperty(
      'message',
      'El estudiante no existe',
    );
  });

  it('deberia inscribir un estudiante a una actividad', async () => {
    const estudiante: Estudiante = estudianteList[0];
    const newEstudiante: Estudiante = await service.incribirseActividad(
      estudiante.id,
      actividad.id,
    );
    expect(newEstudiante).not.toBeNull();
    expect(newEstudiante.actividades.length).toEqual(1);
    expect(newEstudiante.actividades[0].id).toEqual(actividad.id);
  });

  it('deberia lanzar una excepcion por estudiante no encontrado al inscribir', async () => {
    await expect(() =>
      service.incribirseActividad(0, actividad.id),
    ).rejects.toHaveProperty('message', 'El estudiante no existe');
  });

  it('deberia lanzar una excepcion por actividad no encontrada al inscribir', async () => {
    const estudiante: Estudiante = estudianteList[0];
    await expect(() =>
      service.incribirseActividad(estudiante.id, 0),
    ).rejects.toHaveProperty('message', 'La actividad no existe');
  });

  it('deberia lanzar una excepcion por actividad no disponible al inscribir', async () => {
    const estudiante: Estudiante = estudianteList[0];
    actividad.estado = 1;
    await actividadRepository.save(actividad);
    await expect(() =>
      service.incribirseActividad(estudiante.id, actividad.id),
    ).rejects.toHaveProperty('message', 'La actividad no esta disponible');
  });
});
