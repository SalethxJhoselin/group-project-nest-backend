import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Student } from '../student/student.entity';

@Entity('projects')
export class Project {
  @ApiProperty({ description: 'ID único del proyecto' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Sistema de Gestión Académica', description: 'Título del proyecto' })
  @Column()
  title: string;

  @ApiProperty({ example: 'Desarrollo de una plataforma web para la gestión de estudiantes y calificaciones', description: 'Descripción detallada del proyecto' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ example: '2023-01-15T00:00:00.000Z', description: 'Fecha de inicio del proyecto' })
  @Column({ type: 'timestamp' })
  start_date: Date;

  @ApiPropertyOptional({ example: '2023-06-20T00:00:00.000Z', description: 'Fecha de finalización del proyecto' })
  @Column({ type: 'timestamp', nullable: true })
  end_date: Date;

  @ApiPropertyOptional({ example: 'https://github.com/usuario/proyecto-academico', description: 'URL del proyecto (GitHub, Demo, etc.)' })
  @Column({ nullable: true })
  project_url: string;

  @ApiProperty({ description: 'Fecha de creación del registro' })
  @CreateDateColumn()
  creationDate: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ type: () => Student, description: 'Estudiante al que pertenece este proyecto' })
  @ManyToOne(() => Student, (student) => student.projects)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column()
  student_id: string;
}