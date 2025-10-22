// certification.entity.ts
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

@Entity('certifications')
export class Certification {
  @ApiProperty({ description: 'ID único de la certificación' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'AWS Certified Solutions Architect', description: 'Nombre de la certificación' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Amazon Web Services', description: 'Organización que emite la certificación' })
  @Column()
  issuing_organization: string;

  @ApiProperty({ example: '2023-05-15T00:00:00.000Z', description: 'Fecha de emisión' })
  @Column({ type: 'timestamp' })
  issue_date: Date;

  @ApiPropertyOptional({ example: '2025-05-15T00:00:00.000Z', description: 'Fecha de expiración' })
  @Column({ type: 'timestamp', nullable: true })
  expiration_date: Date;

  @ApiPropertyOptional({ example: 'https://www.credly.com/cert/abc123', description: 'URL del certificado' })
  @Column({ nullable: true })
  credential_url: string;

  @ApiProperty({ description: 'Fecha de creación del registro' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ type: () => Student, description: 'Estudiante al que pertenece esta certificación' })
  @ManyToOne(() => Student, (student) => student.certifications)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column()
  student_id: string;
}