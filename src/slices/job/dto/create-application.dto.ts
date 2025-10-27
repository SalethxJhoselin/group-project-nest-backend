import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApplicationStatus } from 'src/enum/applicationHistory.enum';

export class CreateApplicationDto {
  @ApiProperty({ example: 'Estoy interesado en esta posición porque...', required: false })
  @IsOptional()
  @IsString()
  cover_letter?: string;

  @ApiProperty({ example: 'https://example.com/cv.pdf', required: false })
  @IsOptional()
  @IsString()
  resume_url?: string;

  @ApiProperty({ description: 'ID de la vacante' })
  @IsUUID()
  job_id: string;
}

export class UpdateApplicationStatusDto {
  @ApiProperty({ enum: ApplicationStatus, example: ApplicationStatus.REVIEWED })
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}