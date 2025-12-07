import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { Job } from '../job/entity/job.entity';
import { Student } from '../student/student.entity';
import { StudentSkill } from '../skill/entity/student-skill.entity.dto';
import { JobApplication } from '../job/entity/job-application.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, Student, StudentSkill, JobApplication]),
  ],
  providers: [RecommendationService],
  controllers: [RecommendationController],
  exports: [RecommendationService],
})
export class RecommendationModule {}
