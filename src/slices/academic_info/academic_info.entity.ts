// academic_info.entity.ts
import { ApiProperty } from '@nestjs/swagger';
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

@Entity('academic_info')
export class AcademicInfo {
  @ApiProperty({ description: 'ID único de la información académica' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Licenciatura', description: 'Título o grado académico' })
  @Column()
  degree: string;

  @ApiProperty({ example: 'Ingeniería en Sistemas', description: 'Carrera o especialización' })
  @Column()
  major: string;

  @ApiProperty({ example: 'Universidad Central de Venezuela', description: 'Institución educativa' })
  @Column()
  institution: string;

  @ApiProperty({ example: 2020, description: 'Año de inicio de estudios' })
  @Column({ type: 'int' })
  start_year: number;

  @ApiProperty({ example: 2025, description: 'Año estimado de graduación', required: false })
  @Column({ type: 'int', nullable: true })
  estimated_graduation_year: number;

  @ApiProperty({ example: 2024, description: 'Año real de graduación', required: false })
  @Column({ type: 'int', nullable: true })
  graduation_year: number;

  @ApiProperty({ example: 4.5, description: 'Promedio general de calificaciones', required: false })
  @Column({ type: 'float', nullable: true })
  GPA: number;

  @ApiProperty({ description: 'Fecha de creación del registro' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ type: () => Student, description: 'Estudiante al que pertenece esta información' })
  @ManyToOne(() => Student, (student) => student.academicInfo)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column()
  student_id: string;
}