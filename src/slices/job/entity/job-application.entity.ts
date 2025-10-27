import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from 'src/enum/applicationHistory.enum';
import { Student } from 'src/slices/student/student.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { ApplicationHistory } from './application-history.entity';
import { Job } from './job.entity';

@Entity('job_applications')
export class JobApplication {
  @ApiProperty({ description: 'ID único de la aplicación' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    enum: ApplicationStatus,
    example: ApplicationStatus.APPLIED,
    description: 'Estado actual de la aplicación'
  })
  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.APPLIED
  })
  status: ApplicationStatus;

  @ApiProperty({
    example: 'Estoy interesado en esta posición porque...',
    description: 'Carta de presentación',
    required: false
  })
  @Column('text', { nullable: true })
  cover_letter: string;

  @ApiProperty({
    example: 'https://example.com/cv.pdf',
    description: 'URL del CV',
    required: false
  })
  @Column({ nullable: true })
  resume_url: string;

  // Fechas específicas para cada estado
  @ApiProperty({ description: 'Fecha de aplicación', required: false })
  @Column({ type: 'timestamp', nullable: true })
  applied_at: Date;

  @ApiProperty({ description: 'Fecha de revisión', required: false })
  @Column({ type: 'timestamp', nullable: true })
  reviewed_at: Date;

  @ApiProperty({ description: 'Fecha de entrevista', required: false })
  @Column({ type: 'timestamp', nullable: true })
  interview_at: Date;

  @ApiProperty({ description: 'Fecha de prueba técnica', required: false })
  @Column({ type: 'timestamp', nullable: true })
  technical_test_at: Date;

  @ApiProperty({ description: 'Fecha de decisión final', required: false })
  @Column({ type: 'timestamp', nullable: true })
  decided_at: Date;

  @ApiProperty({ description: 'Notas generales de la empresa', required: false })
  @Column('text', { nullable: true })
  company_notes: string;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn()
  created_at: Date;

  // Relaciones
  @ApiProperty({ type: () => Student, description: 'Estudiante que aplica' })
  @ManyToOne(() => Student, (student) => student.jobApplications)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'student_id' })
  student_id: string;

  @ApiProperty({ type: () => Job, description: 'Vacante a la que aplica' })
  @ManyToOne(() => Job, (job) => job.applications)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @Column({ name: 'job_id' })
  job_id: string;

  // Nueva relación con el historial
  @ApiProperty({ type: () => [ApplicationHistory], description: 'Historial de cambios de estado' })
  @OneToMany(() => ApplicationHistory, (history) => history.application)
  history: ApplicationHistory[];

  // Método helper para obtener fechas específicas
  getStatusDate(status: ApplicationStatus): Date | null {
    const historyEntry = this.history?.find(h => h.status === status);
    return historyEntry ? historyEntry.changed_at : null;
  }
}