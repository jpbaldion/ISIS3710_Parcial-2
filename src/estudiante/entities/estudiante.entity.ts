import { Actividad } from '../../actividad/entities/actividad.entity';
import { Resena } from '../../resena/entities/resena.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Estudiante {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  nombre: string;
  @Column()
  cedula: number;
  @Column()
  programa: string;
  @Column()
  semestre: number;
  @Column()
  correo: string;

  @OneToMany(() => Resena, (resena) => resena.estudiante)
  resenas: Resena[];

  @ManyToMany(() => Actividad, (actividad) => actividad.estudiantes)
  @JoinTable()
  actividades: Actividad[];
}
