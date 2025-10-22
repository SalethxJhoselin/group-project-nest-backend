import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Sistema de Gestión Académica', description: 'Título del proyecto' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Desarrollo de una plataforma web para la gestión de estudiantes y calificaciones', description: 'Descripción detallada del proyecto' })
  @IsString()
  description: string;

  @ApiProperty({ example: '2023-01-15T00:00:00.000Z', description: 'Fecha de inicio del proyecto' })
  @IsDate()
  start_date: Date;

  @ApiPropertyOptional({ example: '2023-06-20T00:00:00.000Z', description: 'Fecha de finalización del proyecto' })
  @IsOptional()
  @IsDate()
  end_date?: Date;

  @ApiPropertyOptional({ example: 'https://github.com/usuario/proyecto-academico', description: 'URL del proyecto' })
  @IsOptional()
  @IsUrl()
  project_url?: string;
}

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: 'Plataforma de E-learning', description: 'Título del proyecto' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Desarrollo de una plataforma de aprendizaje en línea con funcionalidades avanzadas', description: 'Descripción detallada del proyecto' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '2023-02-01T00:00:00.000Z', description: 'Fecha de inicio del proyecto' })
  @IsOptional()
  @IsDate()
  start_date?: Date;

  @ApiPropertyOptional({ example: '2023-08-15T00:00:00.000Z', description: 'Fecha de finalización del proyecto' })
  @IsOptional()
  @IsDate()
  end_date?: Date;

  @ApiPropertyOptional({ example: 'https://github.com/usuario/e-learning-platform', description: 'URL del proyecto' })
  @IsOptional()
  @IsUrl()
  project_url?: string;
}

export class ProjectResponseDto {
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
}