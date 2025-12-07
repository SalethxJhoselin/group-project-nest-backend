import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../company/company.entity';
import { CreateJobDto, UpdateJobDto } from './dto/create-job.dto';
import { Job } from './entity/job.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private jobRepo: Repository<Job>,
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
  ) { }

  async create(createJobDto: CreateJobDto & { company_id: string }): Promise<Job> {
    // Verificar que la empresa existe
    const company = await this.companyRepo.findOne({
      where: { id: createJobDto.company_id }
    });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    const job = this.jobRepo.create(createJobDto);
    return await this.jobRepo.save(job);
  }

  async findAll(companyId?: string, jobType?: string, location?: string): Promise<Job[]> {
    const query = this.jobRepo.createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.applications', 'applications')
      .leftJoinAndSelect('applications.student', 'student');

    // Si hay companyId, filtrar por empresa; sino mostrar todas las activas
    if (companyId) {
      query.where('job.company_id = :companyId', { companyId });
    } else {
      query.where('job.is_active = :isActive', { isActive: true });
    }

    if (jobType) {
      query.andWhere('job.job_type = :jobType', { jobType });
    }

    if (location) {
      query.andWhere('LOWER(job.location) LIKE LOWER(:location)', { location: `%${location}%` });
    }

    return await query
      .orderBy('job.created_at', 'DESC')
      .getMany();
  }

  async findActive(): Promise<Job[]> {
    return await this.jobRepo.find({
      where: { is_active: true },
      relations: ['company'],
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Job> {
    const job = await this.jobRepo.findOne({
      where: { id },
      relations: ['company', 'applications']
    });

    if (!job) {
      throw new NotFoundException(`Vacante con ID ${id} no encontrada`);
    }
    return job;
  }

  async findByCompany(companyId: string): Promise<Job[]> {
    return await this.jobRepo.find({
      where: { company_id: companyId },
      relations: ['company', 'applications'],
      order: { created_at: 'DESC' }
    });
  }

  async update(id: string, updateJobDto: UpdateJobDto): Promise<Job> {
    const job = await this.findOne(id);
    Object.assign(job, updateJobDto);
    return await this.jobRepo.save(job);
  }

  async remove(id: string): Promise<void> {
    const job = await this.findOne(id);
    await this.jobRepo.remove(job);
  }

  async deactivate(id: string): Promise<Job> {
    const job = await this.findOne(id);
    job.is_active = false;
    return await this.jobRepo.save(job);
  }

  async checkJobOwnership(jobId: string, companyId: string): Promise<boolean> {
    const job = await this.jobRepo.findOne({
      where: { id: jobId, company_id: companyId }
    });
    return !!job;
  }

  async findJobWithCompanyDetails(jobId: string): Promise<{ job: Job }> {
    const job = await this.jobRepo.findOne({
      where: { id: jobId },
      relations: ['company']
    });

    if (!job) {
      throw new NotFoundException(`Vacante con ID ${jobId} no encontrada`);
    }

    return {
      job
    };
  }
}