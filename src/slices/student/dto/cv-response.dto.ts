import { ApiProperty } from '@nestjs/swagger';
import { SkillLevel } from 'src/enum/skillLevel.enum';
import { AcademicInfo } from '../../academic_info/academic_info.entity';
import { Certification } from '../../certification/certification.entity';
import { Student } from '../student.entity';

class CVProjectDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  start_date: Date;

  @ApiProperty()
  end_date: Date;

  @ApiProperty()
  project_url: string;

  @ApiProperty({ type: [String] })
  technologies: string[];
}

class CVSkillDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: SkillLevel })
  level: SkillLevel;

  @ApiProperty()
  years_experience: number;
}

export class CVResponseDto {
  @ApiProperty({ type: () => Student })
  student: Student;

  @ApiProperty({ type: () => [AcademicInfo] })
  academic_info: AcademicInfo[];

  @ApiProperty({ type: () => [Certification] })
  certifications: Certification[];

  @ApiProperty({ type: () => [CVProjectDto] })
  projects: CVProjectDto[];

  @ApiProperty({ type: () => [CVSkillDto] })
  skills: CVSkillDto[];
}