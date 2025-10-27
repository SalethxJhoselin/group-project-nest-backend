import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../company/company.entity';
import { Student } from '../student/student.entity';
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
      Company,
      Student
    ])
  ],
  providers: [JobService, JobApplicationService],
  controllers: [JobController, JobApplicationController],
  exports: [JobService, JobApplicationService],
})
export class JobModule { }