import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ProjectTechnology } from './project-technology.entity';

@Entity('technologies')
export class Technology {
  @ApiProperty({ description: 'ID único de la tecnología' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'React', description: 'Nombre de la tecnología' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ example: 'Frontend', description: 'Categoría de la tecnología' })
  @Column()
  category: string;

  @ApiProperty({ description: 'Fecha de creación del registro' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ type: () => [ProjectTechnology], description: 'Relaciones con proyectos' })
  @OneToMany(() => ProjectTechnology, (projectTechnology) => projectTechnology.technology)
  projectTechnologies: ProjectTechnology[];
}