import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { StudentSkill } from './student-skill.entity.dto';

@Entity('skills')
export class Skill {
  @ApiProperty({ description: 'ID único del skill' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'JavaScript', description: 'Nombre del skill/habilidad' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ description: 'Fecha de creación del registro' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ type: () => [StudentSkill], description: 'Relaciones con estudiantes' })
  @OneToMany(() => StudentSkill, (studentSkill) => studentSkill.skill)
  studentSkills: StudentSkill[];
}