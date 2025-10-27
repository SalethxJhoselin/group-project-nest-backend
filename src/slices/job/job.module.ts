import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../company/company.entity';
import { Student } from '../student/student.entity';
import { ApplicationHistoryController } from './application-history.controller';
import { ApplicationHistoryService } from './application-history.service';
import { ApplicationHistory } from './entity/application-history.entity';
import { JobApplication } from './entity/job-application.entity';
import { Job } from './entity/job.entity';
import { JobApplicationController } from './job-application.controller';
import { JobApplicationService } from './job-application.service';
import { JobController } from './job.controller';
import { JobService } from './job.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Job,
      JobApplication,
      ApplicationHistory,
      Company,
      Student
    ])
  ],
  providers: [JobService, JobApplicationService, ApplicationHistoryService],
  controllers: [JobController, JobApplicationController, ApplicationHistoryController],
  exports: [JobService, JobApplicationService, ApplicationHistoryService],
})
export class JobModule { }