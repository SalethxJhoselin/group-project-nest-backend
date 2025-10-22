// certification.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../student/student.entity';
import { Certification } from './certification.entity';
import { CreateCertificationDto, UpdateCertificationDto } from './dto/certification.dto';

@Injectable()
export class CertificationService {
  constructor(
    @InjectRepository(Certification)
    private certificationRepo: Repository<Certification>,
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
  ) { }

  async create(studentId: string, dto: CreateCertificationDto): Promise<Certification> {
    const student = await this.studentRepo.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    const certification = this.certificationRepo.create({
      ...dto,
      student,
      student_id: studentId,
    });

    return await this.certificationRepo.save(certification);
  }

  async findByStudentId(studentId: string): Promise<Certification[]> {
    const certifications = await this.certificationRepo.find({
      where: { student_id: studentId },
      order: { issue_date: 'DESC' },
    });

    if (!certifications || certifications.length === 0) {
      throw new NotFoundException('No se encontraron certificaciones para este estudiante');
    }

    return certifications;
  }

  async findOne(id: string): Promise<Certification> {
    const certification = await this.certificationRepo.findOne({ where: { id } });
    if (!certification) {
      throw new NotFoundException('Certificación no encontrada');
    }
    return certification;
  }

  async update(id: string, dto: UpdateCertificationDto): Promise<Certification> {
    const certification = await this.findOne(id);
    Object.assign(certification, dto);
    return await this.certificationRepo.save(certification);
  }

  async delete(id: string): Promise<void> {
    const result = await this.certificationRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Certificación no encontrada');
    }
  }
}