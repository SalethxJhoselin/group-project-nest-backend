import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from 'src/enum/applicationHistory.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { JobApplication } from './job-application.entity';

@Entity('application_history')
export class ApplicationHistory {
  @ApiProperty({ description: 'ID único del registro de historial' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    enum: ApplicationStatus,
    example: ApplicationStatus.REVIEWED,
    description: 'Estado de la aplicación en este punto'
  })
  @Column({
    type: 'enum',
    enum: ApplicationStatus
  })
  status: ApplicationStatus;

  @ApiProperty({
    example: 'CV cumple con los requisitos mínimos',
    description: 'Notas o comentarios sobre el cambio',
    required: false
  })
  @Column('text', { nullable: true })
  notes: string;

  @ApiProperty({
    example: 'company',
    description: 'Quién realizó el cambio',
    enum: ['system', 'student', 'company']
  })
  @Column({ default: 'system' })
  changed_by: string;

  @ApiProperty({ description: 'Fecha y hora del cambio' })
  @CreateDateColumn()
  changed_at: Date;

  // Relación con JobApplication
  @ApiProperty({ type: () => JobApplication, description: 'Aplicación relacionada' })
  @ManyToOne(() => JobApplication, (application) => application.history)
  @JoinColumn({ name: 'application_id' })
  application: JobApplication;

  @Column({ name: 'application_id' })
  application_id: string;
}