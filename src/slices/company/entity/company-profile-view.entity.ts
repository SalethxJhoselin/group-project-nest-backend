import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Student } from '../../student/student.entity';
import { Company } from '../company.entity';

@Entity('company_profile_views')
export class CompanyProfileView {
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

  // Relación con Company
  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'company_id' })
  company_id: string;

  // Relación con Student (opcional - puede ser anónimo)
  @ManyToOne(() => Student, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'student_id', nullable: true })
  student_id: string;
}
