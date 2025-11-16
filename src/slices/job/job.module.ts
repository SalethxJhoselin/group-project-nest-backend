import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Job } from './entity/job.entity';
import { JobApplication } from './entity/job-application.entity';
import { ApplicationHistory } from './entity/application-history.entity';

import { Company } from '../company/company.entity';
import { Student } from '../student/student.entity';

import { JobService } from './job.service';
import { JobApplicationService } from './job-application.service';
import { ApplicationHistoryService } from './application-history.service';

import { JobController } from './job.controller';
import { JobApplicationController } from './job-application.controller';
import { ApplicationHistoryController } from './application-history.controller';

// ⭐ IMPORT THE MODULES NEEDED FOR DI IN JobApplicationService
import { SkillModule } from '../skill/skill.module';
import { ProjectModule } from '../project/project.module';
import { CertificationModule } from '../certification/certification.module';
import { AcademicInfoModule } from '../academic_info/academic-info.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Job,
      JobApplication,
      ApplicationHistory,
      Company,
      Student,
    ]),

    // ⭐ REQUIRED MODULES to inject skill/project/certification/academicInfo services
    SkillModule,
    ProjectModule,
    CertificationModule,
    AcademicInfoModule,
  ],

  controllers: [
    JobController,
    JobApplicationController,
    ApplicationHistoryController,
  ],

  providers: [
    JobService,
    JobApplicationService,
    ApplicationHistoryService,
  ],

  exports: [
    JobService,
    JobApplicationService,
    ApplicationHistoryService,
  ],
})
export class JobModule {}
