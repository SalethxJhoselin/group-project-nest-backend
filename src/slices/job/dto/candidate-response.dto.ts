import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from 'src/enum/applicationHistory.enum';

export class CandidateResponseDto {
  @ApiProperty()
  application_id: string;

  @ApiProperty()
  job_id: string;

  @ApiProperty()
  job_title: string;

  @ApiProperty({ enum: ApplicationStatus })
  status: ApplicationStatus;

  @ApiProperty()
  applied_at: Date;

  // Student basic info
  @ApiProperty()
  student: any;

  // Skills
  @ApiProperty({ type: Array })
  skills: any[];

  // Projects
  @ApiProperty({ type: Array })
  projects: any[];

  // Certifications
  @ApiProperty({ type: Array })
  certifications: any[];

  // Academic info
  @ApiProperty({ type: Array })
  academicInfo: any[];

  // Match %
  @ApiProperty()
  match: number;
}
