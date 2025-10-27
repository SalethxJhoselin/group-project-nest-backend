import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicInfo } from '../academic_info/academic_info.entity';
import { Certification } from '../certification/certification.entity';
import { JobApplication } from '../job/entity/job-application.entity';
import { Project } from '../project/project.entity';
import { StudentSkill } from '../skill/entity/student-skill.entity.dto';
import { StudentController } from './student.controller';
import { Student } from './student.entity';
import { StudentService } from './student.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student,
    AcademicInfo,
    Certification,
    Project,
    StudentSkill,
    JobApplication])],
  providers: [StudentService],
  controllers: [StudentController],
  exports: [StudentService],
})
export class StudentModule { }