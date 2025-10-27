import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { SkillLevel } from 'src/enum/skillLevel.enum';

export class CreateSkillDto {
  @ApiProperty({ example: 'React', description: 'Nombre del skill/habilidad' })
  @IsString()
  name: string;
}

export class AddSkillToStudentDto {
  @ApiProperty({ example: 'abc12345-6789-0def-ghij-klmnopqrstuv', description: 'ID del skill' })
  @IsString()
  skill_id: string;

  @ApiProperty({
    enum: SkillLevel,
    example: SkillLevel.INTERMEDIATE,
    description: 'Nivel de habilidad'
  })
  @IsEnum(SkillLevel)
  level: SkillLevel;

  @ApiProperty({ example: 2, description: 'Años de experiencia', minimum: 0, maximum: 50 })
  @IsNumber()
  @Min(0)
  @Max(50)
  years_experience: number;
}

export class UpdateStudentSkillDto {
  @ApiPropertyOptional({
    enum: SkillLevel,
    example: SkillLevel.ADVANCED,
    description: 'Nivel de habilidad'
  })
  @IsOptional()
  @IsEnum(SkillLevel)
  level?: SkillLevel;

  @ApiPropertyOptional({ example: 3, description: 'Años de experiencia', minimum: 0, maximum: 50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  years_experience?: number;
}

export class SkillResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class StudentSkillResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: SkillLevel })
  level: SkillLevel;

  @ApiProperty()
  years_experience: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty({ type: () => SkillResponseDto })
  skill: SkillResponseDto;
}

// DTO para la respuesta del estudiante que incluye skills
export class StudentWithSkillsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  CI: number;

  @ApiProperty()
  registration_number: number;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiPropertyOptional()
  phone_number?: string;

  @ApiPropertyOptional()
  profile_photo_url?: string;

  @ApiProperty()
  birthDate: Date;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  bio?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({ type: () => [StudentSkillResponseDto] })
  studentSkills: StudentSkillResponseDto[];
}