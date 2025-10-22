// academic_info.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateAcademicInfoDto {
  @ApiProperty({ example: 'Licenciatura', description: 'Título o grado académico' })
  @IsString()
  degree: string;

  @ApiProperty({ example: 'Ingeniería en Sistemas', description: 'Carrera o especialización' })
  @IsString()
  major: string;

  @ApiProperty({ example: 'Universidad Central de Venezuela', description: 'Institución educativa' })
  @IsString()
  institution: string;

  @ApiProperty({ example: 2020, description: 'Año de inicio de estudios', minimum: 1900, maximum: 2100 })
  @IsNumber()
  @Min(1900)
  @Max(2100)
  start_year: number;

  @ApiPropertyOptional({ example: 2025, description: 'Año estimado de graduación', minimum: 1900, maximum: 2100 })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(2100)
  estimated_graduation_year?: number;

  @ApiPropertyOptional({ example: 2024, description: 'Año real de graduación', minimum: 1900, maximum: 2100 })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(2100)
  graduation_year?: number;

  @ApiPropertyOptional({ example: 4.5, description: 'Promedio general de calificaciones', minimum: 0, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  GPA?: number;
}

export class UpdateAcademicInfoDto {
  @ApiPropertyOptional({ example: 'Ingeniería', description: 'Título o grado académico' })
  @IsOptional()
  @IsString()
  degree?: string;

  @ApiPropertyOptional({ example: 'Ingeniería en Computación', description: 'Carrera o especialización' })
  @IsOptional()
  @IsString()
  major?: string;

  @ApiPropertyOptional({ example: 'Universidad de Los Andes', description: 'Institución educativa' })
  @IsOptional()
  @IsString()
  institution?: string;

  @ApiPropertyOptional({ example: 2021, description: 'Año de inicio de estudios', minimum: 1900, maximum: 2100 })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(2100)
  start_year?: number;

  @ApiPropertyOptional({ example: 2026, description: 'Año estimado de graduación', minimum: 1900, maximum: 2100 })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(2100)
  estimated_graduation_year?: number;

  @ApiPropertyOptional({ example: 2025, description: 'Año real de graduación', minimum: 1900, maximum: 2100 })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(2100)
  graduation_year?: number;

  @ApiPropertyOptional({ example: 4.2, description: 'Promedio general de calificaciones', minimum: 0, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  GPA?: number;
}

export class AcademicInfoResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  degree: string;

  @ApiProperty()
  major: string;

  @ApiProperty()
  institution: string;

  @ApiProperty()
  start_year: number;

  @ApiProperty({ required: false })
  estimated_graduation_year?: number;

  @ApiProperty({ required: false })
  graduation_year?: number;

  @ApiProperty({ required: false })
  GPA?: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  student_id: string;
}