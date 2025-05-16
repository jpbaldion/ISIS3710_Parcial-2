import { Estudiante } from 'src/estudiante/entities/estudiante.entity';
import { Resena } from 'src/resena/entities/resena.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Actividad {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  fecha: string;
  @Column()
  cupoMaximo: number;
  @Column()
  estado: number;
  @Column()
  titulo: string;

  @OneToMany(() => Resena, (resena) => resena.actividad)
  resenas: Resena[];

  @ManyToMany(() => Estudiante, (estudiante) => estudiante.actividades)
  estudiantes: Estudiante[];
}
