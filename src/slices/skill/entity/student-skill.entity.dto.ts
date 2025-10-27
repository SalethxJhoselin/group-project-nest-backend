import { ApiProperty } from '@nestjs/swagger';
import { SkillLevel } from 'src/enum/skillLevel.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm';
import { Student } from '../../student/student.entity';
import { Skill } from './skill.entity';

@Entity('student_skills')
@Unique(['student_id', 'skill_id']) // Un estudiante no puede tener el mismo skill duplicado
export class StudentSkill {
  @ApiProperty({ description: 'ID único de la relación estudiante-skill' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    enum: SkillLevel,
    example: SkillLevel.INTERMEDIATE,
    description: 'Nivel de habilidad del estudiante'
  })
  @Column({
    type: 'enum',
    enum: SkillLevel,
    default: SkillLevel.BEGINNER
  })
  level: SkillLevel;

  @ApiProperty({ example: 2, description: 'Años de experiencia con esta habilidad' })
  @Column({ type: 'int', default: 0 })
  years_experience: number;

  @ApiProperty({ description: 'Fecha de creación del registro' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ type: () => Student, description: 'Estudiante relacionado' })
  @ManyToOne(() => Student, (student) => student.studentSkills, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column()
  student_id: string;

  @ApiProperty({ type: () => Skill, description: 'Skill relacionado' })
  @ManyToOne(() => Skill, (skill) => skill.studentSkills, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;

  @Column()
  skill_id: string;
}