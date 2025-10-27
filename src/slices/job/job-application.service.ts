import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../student/student.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationStatus, JobApplication } from './entity/job-application.entity';
import { Job } from './entity/job.entity';

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectRepository(JobApplication)
    private applicationRepo: Repository<JobApplication>,
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
    @InjectRepository(Job)
    private jobRepo: Repository<Job>,
  ) { }

  async create(createApplicationDto: CreateApplicationDto & { student_id: string }): Promise<JobApplication> {
    // Verificar que el estudiante existe
    const student = await this.studentRepo.findOne({
      where: { id: createApplicationDto.student_id }
    });
    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    // Verificar que la vacante existe y está activa
    const job = await this.jobRepo.findOne({
      where: { id: createApplicationDto.job_id, is_active: true }
    });
    if (!job) {
      throw new NotFoundException('Vacante no encontrada o inactiva');
    }

    // Verificar si ya aplicó
    const existingApplication = await this.applicationRepo.findOne({
      where: {
        student_id: createApplicationDto.student_id,
        job_id: createApplicationDto.job_id
      }
    });

    if (existingApplication) {
      throw new ConflictException('Ya has aplicado a esta vacante');
    }

    // Verificar que no haya pasado la fecha límite
    if (new Date() > job.deadline) {
      throw new ConflictException('La fecha límite para aplicar ha pasado');
    }

    const application = this.applicationRepo.create({
      ...createApplicationDto,
      applied_at: new Date()
    });

    return await this.applicationRepo.save(application);
  }

  async findByStudent(studentId: string): Promise<JobApplication[]> {
    return await this.applicationRepo.find({
      where: { student_id: studentId },
      relations: ['job', 'job.company'],
      order: { applied_at: 'DESC' }
    });
  }

  async findByJob(jobId: string): Promise<JobApplication[]> {
    return await this.applicationRepo.find({
      where: { job_id: jobId },
      relations: ['student'],
      order: { applied_at: 'DESC' }
    });
  }

  async findOne(id: string): Promise<JobApplication> {
    const application = await this.applicationRepo.findOne({
      where: { id },
      relations: ['student', 'job', 'job.company']
    });

    if (!application) {
      throw new NotFoundException(`Aplicación con ID ${id} no encontrada`);
    }
    return application;
  }

  async updateStatus(id: string, status: ApplicationStatus): Promise<JobApplication> {
    const application = await this.findOne(id);
    application.status = status;
    return await this.applicationRepo.save(application);
  }

  async checkExistingApplication(studentId: string, jobId: string): Promise<boolean> {
    const application = await this.applicationRepo.findOne({
      where: {
        student_id: studentId,
        job_id: jobId
      }
    });
    return !!application;
  }

  async getApplicationStats(jobId: string): Promise<{ total: number; byStatus: Record<ApplicationStatus, number> }> {
    const applications = await this.applicationRepo.find({
      where: { job_id: jobId }
    });

    const byStatus = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<ApplicationStatus, number>);

    return {
      total: applications.length,
      byStatus
    };
  }
}