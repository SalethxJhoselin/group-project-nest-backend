import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AcademicInfoModule } from './slices/academic_info/academic-info.module';
import { AuthModule } from './slices/auth/auth.module';
import { CertificationModule } from './slices/certification/certification.module';
import { CompanyModule } from './slices/company/company.module';
import { JobModule } from './slices/job/job.module';
import { ProjectModule } from './slices/project/project.module';
import { SkillModule } from './slices/skill/skill.module';
import { StudentModule } from './slices/student/student.module';
import { TechnologyModule } from './slices/technology/technology.module';
import { RecommendationModule } from './slices/recommendation/recommendation.module';
import { AdminModule } from './slices/admin/admin.module';
import { TestsModule } from './tests/tests.module';
import { StatsModule } from './slices/stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    StudentModule,
    CompanyModule,
    AcademicInfoModule,
    CertificationModule,
    ProjectModule,
    SkillModule,
    TechnologyModule,
    JobModule,
    RecommendationModule,
    AdminModule,
    TestsModule,
    StatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
