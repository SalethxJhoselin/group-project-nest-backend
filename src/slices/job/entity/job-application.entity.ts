import { ApiProperty } from '@nestjs/swagger';
import { Student } from 'src/slices/student/student.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Job } from './job.entity';

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  INTERVIEW = 'interview',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted'
}

@Entity('job_applications')
export class JobApplication {
  @ApiProperty({ description: 'ID único de la aplicación' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    enum: ApplicationStatus,
    example: ApplicationStatus.PENDING,
    description: 'Estado de la aplicación'
  })
  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING
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

  @ApiProperty({ description: 'Fecha de aplicación' })
  @CreateDateColumn()
  applied_at: Date;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn()
  created_at: Date;

  // Relación con Student
  @ApiProperty({ type: () => Student, description: 'Estudiante que aplica' })
  @ManyToOne(() => Student, (student) => student.jobApplications)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'student_id' })
  student_id: string;

  // Relación con Job
  @ApiProperty({ type: () => Job, description: 'Vacante a la que aplica' })
  @ManyToOne(() => Job, (job) => job.applications)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @Column({ name: 'job_id' })
  job_id: string;
}