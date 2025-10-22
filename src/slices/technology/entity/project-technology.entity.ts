import { ApiProperty } from '@nestjs/swagger';
import { Project } from 'src/slices/project/project.entity';
import {
  Column, CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm';
import { Technology } from './technology.entity';

@Entity('project_technologies')
@Unique(['project_id', 'technology_id']) // Un proyecto no puede tener la misma tecnología duplicada
export class ProjectTechnology {
  @ApiProperty({ description: 'ID único de la relación proyecto-tecnología' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Fecha de creación del registro' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ type: () => Project, description: 'Proyecto relacionado' })
  @ManyToOne(() => Project, (project) => project.projectTechnologies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column()
  project_id: string;

  @ApiProperty({ type: () => Technology, description: 'Tecnología relacionada' })
  @ManyToOne(() => Technology, (technology) => technology.projectTechnologies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'technology_id' })
  technology: Technology;

  @Column()
  technology_id: string;
}