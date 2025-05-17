import { Actividad } from '../../actividad/entities/actividad.entity';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Resena {
  @PrimaryColumn()
  id: number;
  @Column()
  comentario: string;
  @Column()
  calificacion: number;
  @Column()
  fecha: string;

  @ManyToOne(() => Estudiante, (estudiante) => estudiante.resenas)
  estudiante: Estudiante;

  @ManyToOne(() => Actividad, (actividad) => actividad.resenas)
  actividad: Actividad;
}
