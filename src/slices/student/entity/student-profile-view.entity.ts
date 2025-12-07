import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Company } from '../../company/company.entity';
import { Student } from '../student.entity';

@Entity('student_profile_views')
export class StudentProfileView {
  @ApiProperty({ description: 'ID único de la vista' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Fecha y hora de la vista' })
  @CreateDateColumn()
  viewed_at: Date;

  @ApiProperty({ description: 'IP del visitante', required: false })
  @Column({ nullable: true })
  ip_address: string;

  @ApiProperty({ description: 'User agent del navegador', required: false })
  @Column('text', { nullable: true })
  user_agent: string;

  // Relación con Student
  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'student_id' })
  student_id: string;

  // Relación con Company (quien vio el perfil)
  @ManyToOne(() => Company, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'company_id', nullable: true })
  company_id: string;
}
