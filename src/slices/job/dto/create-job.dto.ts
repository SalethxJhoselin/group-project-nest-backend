import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateJobDto {
  @ApiProperty({ example: 'Desarrollador Full Stack' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Buscamos desarrollador con experiencia...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'React, Node.js, PostgreSQL', required: false })
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiProperty({ example: 'Desarrollar features, code review', required: false })
  @IsOptional()
  @IsString()
  responsibilities?: string;

  @ApiProperty({ example: '$1000-$1500', required: false })
  @IsOptional()
  @IsString()
  salary_range?: string;

  @ApiProperty({ example: 'Remoto' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: '2024-12-31T23:59:59.999Z' })
  @IsDateString()
  @IsNotEmpty()
  deadline: Date;

  @ApiProperty({ example: 'full-time', required: false })
  @IsOptional()
  @IsString()
  job_type?: string;
}

export class UpdateJobDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  responsibilities?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  salary_range?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  deadline?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  job_type?: string;
}