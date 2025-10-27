import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationStatus } from 'src/enum/applicationHistory.enum';
import { Repository } from 'typeorm';
import { Student } from '../student/student.entity';
import { ApplicationHistoryService } from './application-history.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationHistory } from './entity/application-history.entity';
import { JobApplication } from './entity/job-application.entity';
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
    private historyService: ApplicationHistoryService
  ) { }

  async create(createApplicationDto: CreateApplicationDto & { student_id: string }): Promise<JobApplication> {
    // Validaciones existentes...
    const student = await this.studentRepo.findOne({
      where: { id: createApplicationDto.student_id }
    });
    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    const job = await this.jobRepo.findOne({
      where: { id: createApplicationDto.job_id, is_active: true }
    });
    if (!job) {
      throw new NotFoundException('Vacante no encontrada o inactiva');
    }

    const existingApplication = await this.applicationRepo.findOne({
      where: {
        student_id: createApplicationDto.student_id,
        job_id: createApplicationDto.job_id
      }
    });

    if (existingApplication) {
      throw new ConflictException('Ya has aplicado a esta vacante');
    }

    if (new Date() > job.deadline) {
      throw new ConflictException('La fecha límite para aplicar ha pasado');
    }

    const application = this.applicationRepo.create({
      ...createApplicationDto,
      applied_at: new Date(),
      status: ApplicationStatus.APPLIED
    });

    const savedApplication = await this.applicationRepo.save(application);

    // Crear primer registro en el historial
    await this.historyService.createHistoryEntry(
      savedApplication,
      ApplicationStatus.APPLIED,
      'Aplicación enviada',
      'student'
    );

    return savedApplication;
  }

  private updateSpecificDate(application: JobApplication, status: ApplicationStatus): void {
    const now = new Date();
    switch (status) {
      case ApplicationStatus.APPLIED:
        application.applied_at = now;
        break;
      case ApplicationStatus.REVIEWED:
        application.reviewed_at = now;
        break;
      case ApplicationStatus.INTERVIEW:
      case ApplicationStatus.FINAL_INTERVIEW:
        application.interview_at = now;
        break;
      case ApplicationStatus.TECHNICAL_TEST:
        application.technical_test_at = now;
        break;
      case ApplicationStatus.REJECTED:
      case ApplicationStatus.ACCEPTED:
      case ApplicationStatus.WITHDRAWN:
        application.decided_at = now;
        break;
    }
  }

  async getApplicationTimeline(applicationId: string): Promise<ApplicationHistory[]> {
    return await this.historyService.getApplicationHistory(applicationId);
  }

  async getFullApplicationDetails(applicationId: string) {
    const application = await this.applicationRepo.findOne({
      where: { id: applicationId },
      relations: ['student', 'job', 'job.company', 'history']
    });

    if (!application) {
      throw new NotFoundException('Aplicación no encontrada');
    }

    const timeline = await this.historyService.getApplicationHistory(applicationId);
    const lastChange = await this.historyService.getLastStatusChange(applicationId);

    return {
      application,
      timeline,
      last_status_change: lastChange,
      current_status_duration: lastChange
        ? this.getDaysSince(lastChange.changed_at)
        : 0
    };
  }

  private getDaysSince(date: Date): number {
    return Math.ceil((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
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

  async updateStatus(
    id: string,
    status: ApplicationStatus,
    notes?: string,
    changedBy: string = 'system'
  ): Promise<JobApplication> {
    const application = await this.findOne(id);

    // Actualizar estado de la aplicación
    application.status = status;

    // Actualizar fecha específica si corresponde
    this.updateSpecificDate(application, status);

    const updatedApplication = await this.applicationRepo.save(application);

    // Crear registro en el historial
    await this.historyService.createHistoryEntry(
      updatedApplication,
      status,
      notes,
      changedBy
    );

    return updatedApplication;
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