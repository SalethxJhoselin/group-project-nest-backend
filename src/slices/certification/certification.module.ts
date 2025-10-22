import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../student/student.entity';
import { CertificationController } from './certification.controller';
import { Certification } from './certification.entity';
import { CertificationService } from './certification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Certification, Student])],
  providers: [CertificationService],
  controllers: [CertificationController],
  exports: [CertificationService],
})
export class CertificationModule { }