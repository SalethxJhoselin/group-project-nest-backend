import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AcademicInfoModule } from './slices/academic_info/academic-info.module';
import { AuthModule } from './slices/auth/auth.module';
import { CertificationModule } from './slices/certification/certification.module';
import { CompanyModule } from './slices/company/company.module';
import { ProjectModule } from './slices/project/project.module';
import { SkillModule } from './slices/skill/skill.module';
import { StudentModule } from './slices/student/student.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    StudentModule,
    CompanyModule,
    AcademicInfoModule,
    CertificationModule,
    ProjectModule,
    SkillModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
