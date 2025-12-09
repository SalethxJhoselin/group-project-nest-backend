import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Student } from '../student/student.entity';
import { Company } from '../company/company.entity';
import { Job } from '../job/entity/job.entity';
import { JobApplication } from '../job/entity/job-application.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Student, Company, Job, JobApplication]),
    ],
    controllers: [StatsController],
    providers: [StatsService],
    exports: [StatsService],
})
export class StatsModule { }
