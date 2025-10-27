import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Company } from '../../company/company.entity';
import { JobApplication } from './job-application.entity';

@Entity('jobs')
export class Job {
  @ApiProperty({ description: 'ID único de la vacante' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Desarrollador Full Stack', description: 'Título de la vacante' })
  @Column()
  title: string;

  @ApiProperty({ example: 'Buscamos desarrollador con experiencia...', description: 'Descripción detallada' })
  @Column('text')
  description: string;

  @ApiProperty({ example: 'React, Node.js, PostgreSQL', description: 'Requisitos técnicos', required: false })
  @Column('text', { nullable: true })
  requirements: string;

  @ApiProperty({ example: 'Desarrollar features, code review', description: 'Responsabilidades', required: false })
  @Column('text', { nullable: true })
  responsibilities: string;

  @ApiProperty({ example: '$1000-$1500', description: 'Rango salarial', required: false })
  @Column({ nullable: true })
  salary_range: string;

  @ApiProperty({ example: 'Remoto', description: 'Ubicación del trabajo' })
  @Column()
  location: string;

  @ApiProperty({ example: true, description: 'Si la vacante está activa' })
  @Column({ default: true })
  is_active: boolean;

  @ApiProperty({ example: '2024-12-31', description: 'Fecha límite para aplicar' })
  @Column({ type: 'timestamp' })
  deadline: Date;

  @ApiProperty({ example: 'full-time', description: 'Tipo de empleo' })
  @Column({ default: 'full-time' })
  job_type: string; // full-time, part-time, internship, remote

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @UpdateDateColumn()
  updated_at: Date;

  // Relación con Company
  @ApiProperty({ type: () => Company, description: 'Empresa que publica la vacante' })
  @ManyToOne(() => Company, (company) => company.jobs)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'company_id' })
  company_id: string;

  // Relación con aplicaciones
  @ApiProperty({ type: () => [JobApplication], description: 'Aplicaciones a esta vacante' })
  @OneToMany(() => JobApplication, (application) => application.job)
  applications: JobApplication[];
}