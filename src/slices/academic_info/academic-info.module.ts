// academic-info.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../student/student.entity';
import { AcademicInfoController } from './academic_info.controller';
import { AcademicInfo } from './academic_info.entity';
import { AcademicInfoService } from './academic_info.service';

@Module({
  imports: [TypeOrmModule.forFeature([AcademicInfo, Student])],
  providers: [AcademicInfoService],
  controllers: [AcademicInfoController],
  exports: [AcademicInfoService],
})
export class AcademicInfoModule { }