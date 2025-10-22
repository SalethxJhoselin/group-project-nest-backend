// academic_info.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../student/student.entity';
import { AcademicInfo } from './academic_info.entity';
import { CreateAcademicInfoDto, UpdateAcademicInfoDto } from './dto/academic_info.dto';

@Injectable()
export class AcademicInfoService {
  constructor(
    @InjectRepository(AcademicInfo)
    private academicInfoRepo: Repository<AcademicInfo>,
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
  ) { }

  async create(studentId: string, dto: CreateAcademicInfoDto): Promise<AcademicInfo> {
    const student = await this.studentRepo.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    const academicInfo = this.academicInfoRepo.create({
      ...dto,
      student,
      student_id: studentId,
    });

    return await this.academicInfoRepo.save(academicInfo);
  }

  async findByStudentId(studentId: string): Promise<AcademicInfo[]> {
    const academicInfo = await this.academicInfoRepo.find({
      where: { student_id: studentId },
      order: { start_year: 'DESC' },
    });

    if (!academicInfo || academicInfo.length === 0) {
      throw new NotFoundException('No se encontró información académica para este estudiante');
    }

    return academicInfo;
  }

  async findOne(id: string): Promise<AcademicInfo> {
    const academicInfo = await this.academicInfoRepo.findOne({ where: { id } });
    if (!academicInfo) {
      throw new NotFoundException('Información académica no encontrada');
    }
    return academicInfo;
  }

  async update(id: string, dto: UpdateAcademicInfoDto): Promise<AcademicInfo> {
    const academicInfo = await this.findOne(id);
    Object.assign(academicInfo, dto);
    return await this.academicInfoRepo.save(academicInfo);
  }

  async delete(id: string): Promise<void> {
    const result = await this.academicInfoRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Información académica no encontrada');
    }
  }
}