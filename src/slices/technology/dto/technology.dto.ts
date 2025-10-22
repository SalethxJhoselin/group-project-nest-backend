import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateTechnologyDto {
  @ApiProperty({ example: 'React', description: 'Nombre de la tecnología' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Frontend', description: 'Categoría de la tecnología' })
  @IsString()
  category: string;
}

export class AddTechnologyToProjectDto {
  @ApiProperty({ example: 'abc12345-6789-0def-ghij-klmnopqrstuv', description: 'ID de la tecnología' })
  @IsString()
  technology_id: string;
}

export class UpdateTechnologyDto {
  @ApiPropertyOptional({ example: 'React.js', description: 'Nombre de la tecnología' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'JavaScript Framework', description: 'Categoría de la tecnología' })
  @IsOptional()
  @IsString()
  category?: string;
}

export class TechnologyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class ProjectTechnologyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty({ type: () => TechnologyResponseDto })
  technology: TechnologyResponseDto;
}

// DTO para la respuesta del proyecto que incluye tecnologías
export class ProjectWithTechnologiesResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  start_date: Date;

  @ApiPropertyOptional()
  end_date?: Date;

  @ApiPropertyOptional()
  project_url?: string;

  @ApiProperty()
  creationDate: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  student_id: string;

  @ApiProperty({ type: () => [ProjectTechnologyResponseDto] })
  projectTechnologies: ProjectTechnologyResponseDto[];
}