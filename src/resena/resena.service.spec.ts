import { Test, TestingModule } from '@nestjs/testing';
import { ResenaService } from './resena.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { Actividad } from 'src/actividad/entities/actividad.entity';
import { Resena } from './entities/resena.entity';
import { Estudiante } from '../estudiante/entities/estudiante.entity';

import { faker } from '@faker-js/faker';

describe('ResenaService', () => {
  let service: ResenaService;
  let actividadRepository: Repository<Actividad>;
  let resenaRepository: Repository<Resena>;
  let usuarioRepository: Repository<Estudiante>;
  let resenaList: Resena[];
  let actividadList: Actividad[];
  let estudianteList: Estudiante[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ResenaService],
    }).compile();

    service = module.get<ResenaService>(ResenaService);
    actividadRepository = module.get<Repository<Actividad>>(
      'ActividadRepository',
    );
    resenaRepository = module.get<Repository<Resena>>('ResenaRepository');
    usuarioRepository = module.get<Repository<Estudiante>>(
      'EstudianteRepository',
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await resenaRepository.clear();
    resenaList = [];
    actividadList = [];
    estudianteList = [];

    for (let i = 0; i < 3; i++) {
      const actividad = await actividadRepository.save({
        fecha: faker.date.past().toString(),
        cupoMaximo: faker.number.int({ min: 1, max: 100 }),
        estado: i,
        titulo: faker.lorem.sentence(),
      });
      actividadList.push(actividad);
    }

    const actividad = await actividadRepository.save({
      fecha: faker.date.past().toString(),
      cupoMaximo: faker.number.int({ min: 1, max: 100 }),
      estado: 0,
      titulo: faker.lorem.sentence(),
    });

    actividadList.push(actividad);

    for (let i = 0; i < 3; i++) {
      const actividad = await actividadRepository.save({
        fecha: faker.date.past().toString(),
        cupoMaximo: faker.number.int({ min: 1, max: 100 }),
        estado: i,
        titulo: faker.lorem.sentence(),
      });
      actividadList.push(actividad);
    }

    const estudiante = await usuarioRepository.save({
      nombre: faker.person.firstName(),
      cedula: faker.number.int({ min: 10000000, max: 99999999 }),
      programa: faker.person.jobArea(),
      semestre: faker.number.int({ min: 1, max: 10 }),
      correo: faker.internet.email(),
      actividades: [actividad],
    });
    estudianteList.push(estudiante);

    const estudiante2 = await usuarioRepository.save({
      nombre: faker.person.firstName(),
      cedula: faker.number.int({ min: 10000000, max: 99999999 }),
      programa: faker.person.jobArea(),
      semestre: faker.number.int({ min: 1, max: 10 }),
      correo: faker.internet.email(),
      actividades: [actividad[0]],
    });

    estudianteList.push(estudiante2);

    actividad.estado = 2;
    await actividadRepository.save(actividad);

    for (let i = 0; i < 5; i++) {
      const resena: Resena = await resenaRepository.save({
        comentario: faker.lorem.sentence(),
        calificacion: faker.number.int({ min: 1, max: 5 }),
        fecha: faker.date.past().toString(),
        actividad,
        estudiante,
      });
      resenaList.push(resena);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deberia crear una reseña', async () => {
    const resena: Resena = {
      id: 0,
      comentario: faker.lorem.sentence(),
      calificacion: faker.number.int({ min: 1, max: 5 }),
      fecha: faker.date.past().toString(),
      actividad: actividadList[3],
      estudiante: estudianteList[0],
    };

    const newResena = await service.agregarReseña(resena);
    expect(newResena).not.toBeNull();
    expect(newResena.comentario).toEqual(resena.comentario);
    expect(newResena.calificacion).toEqual(resena.calificacion);
    expect(newResena.fecha).toEqual(resena.fecha);
  });

  it('deberia lanzar una excepcion por actividad no encontrada', async () => {
    const resena: Resena = {
      id: 0,
      comentario: faker.lorem.sentence(),
      calificacion: faker.number.int({ min: 1, max: 5 }),
      fecha: faker.date.past().toString(),
      actividad: {
        id: 0,
        fecha: faker.date.past().toString(),
        cupoMaximo: faker.number.int({ min: 1, max: 100 }),
        estado: 0,
        titulo: faker.lorem.sentence(),
        resenas: [],
        estudiantes: [],
      },
      estudiante: estudianteList[0],
    };

    await expect(() => service.agregarReseña(resena)).rejects.toHaveProperty(
      'message',
      'Actividad no encontrada',
    );
  });

  it('deberia lanzar una excepcion por estudiante no encontrado', async () => {
    const resena: Resena = {
      id: 0,
      comentario: faker.lorem.sentence(),
      calificacion: faker.number.int({ min: 1, max: 5 }),
      fecha: faker.date.past().toString(),
      actividad: actividadList[3],
      estudiante: {
        id: 0,
        nombre: faker.person.firstName(),
        cedula: faker.number.int({ min: 10000000, max: 99999999 }),
        programa: faker.person.jobArea(),
        semestre: faker.number.int({ min: 1, max: 10 }),
        correo: faker.internet.email(),
        actividades: [],
        resenas: [],
      },
    };

    await expect(() => service.agregarReseña(resena)).rejects.toHaveProperty(
      'message',
      'Estudiante no encontrado',
    );
  });

  it('deberia lanzar una excepcion por estudiante no inscrito en la actividad', async () => {
    const resena: Resena = {
      id: 0,
      comentario: faker.lorem.sentence(),
      calificacion: faker.number.int({ min: 1, max: 5 }),
      fecha: faker.date.past().toString(),
      actividad: actividadList[3],
      estudiante: estudianteList[1],
    };

    await expect(() => service.agregarReseña(resena)).rejects.toHaveProperty(
      'message',
      'El estudiante no ha participado en esta actividad',
    );
  });

  it('deberia lanzar una excepcion por actividad no finalizada', async () => {
    const resena: Resena = {
      id: 0,
      comentario: faker.lorem.sentence(),
      calificacion: faker.number.int({ min: 1, max: 5 }),
      fecha: faker.date.past().toString(),
      actividad: actividadList[1],
      estudiante: estudianteList[1],
    };

    await expect(() => service.agregarReseña(resena)).rejects.toHaveProperty(
      'message',
      'No se puede agregar reseña a una actividad que no ha sido finalizada',
    );
  });

  it('deberia encontrar una reseña por id', async () => {
    const resena: Resena = resenaList[0];
    const foundResena: Resena = await service.findResenaById(resena.id);
    expect(foundResena).not.toBeNull();
    expect(foundResena.comentario).toEqual(resena.comentario);
    expect(foundResena.calificacion).toEqual(resena.calificacion);
    expect(foundResena.fecha).toEqual(resena.fecha);
  });

  it('deberia lanzar una excepcion por reseña no encontrada', async () => {
    await expect(() => service.findResenaById(0)).rejects.toHaveProperty(
      'message',
      'No se encontró la reseña con el id 0',
    );
  });
});
