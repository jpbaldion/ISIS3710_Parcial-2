import { Actividad } from 'src/actividad/entities/actividad.entity';
import { Resena } from 'src/resena/entities/resena.entity';
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
  nomber: string;
  @Column()
  cedula: number;
  @Column()
  progrma: string;
  @Column()
  semetre: number;
  @Column()
  correo: string;

  @OneToMany(() => Resena, (resena) => resena.estudiante)
  resenas: Resena[];

  @ManyToMany(() => Actividad, (actividad) => actividad.estudiantes)
  @JoinTable()
  actividades: Actividad[];
}
