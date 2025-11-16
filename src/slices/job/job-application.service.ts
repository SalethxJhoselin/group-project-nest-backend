import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationStatus } from 'src/enum/applicationHistory.enum';
import { Repository, In } from 'typeorm';

import { Student } from '../student/student.entity';
import { ApplicationHistoryService } from './application-history.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JobApplication } from './entity/job-application.entity';
import { Job } from './entity/job.entity';

import { SkillService } from '../skill/skill.service';
import { ProjectService } from '../project/project.service';

import { CertificationService } from '../certification/certification.service';
import { AcademicInfoService } from '../academic_info/academic_info.service';

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectRepository(JobApplication)
    private applicationRepo: Repository<JobApplication>,

    @InjectRepository(Student)
    private studentRepo: Repository<Student>,

    @InjectRepository(Job)
    private jobRepo: Repository<Job>,

    private historyService: ApplicationHistoryService,

    private skillService: SkillService,
    private projectService: ProjectService,
    private certificationService: CertificationService,
    private academicInfoService: AcademicInfoService
  ) {}


  async create(createApplicationDto: CreateApplicationDto & { student_id: string }) {
    const student = await this.studentRepo.findOne({
      where: { id: createApplicationDto.student_id }
    });
    if (!student) throw new NotFoundException('Estudiante no encontrado');

    const job = await this.jobRepo.findOne({
      where: { id: createApplicationDto.job_id, is_active: true }
    });
    if (!job) throw new NotFoundException('Vacante no encontrada o inactiva');

    const existing = await this.applicationRepo.findOne({
      where: {
        student_id: createApplicationDto.student_id,
        job_id: createApplicationDto.job_id
      }
    });

    if (existing) throw new ConflictException('Ya has aplicado a esta vacante');

    if (new Date() > job.deadline)
      throw new ConflictException('La fecha límite para aplicar ha pasado');

    const application = this.applicationRepo.create({
      ...createApplicationDto,
      applied_at: new Date(),
      status: ApplicationStatus.APPLIED
    });

    const saved = await this.applicationRepo.save(application);

    await this.historyService.createHistoryEntry(
      saved,
      ApplicationStatus.APPLIED,
      'Aplicación enviada',
      'student'
    );

    return saved;
  }

  findByStudent(studentId: string) {
    return this.applicationRepo.find({
      where: { student_id: studentId },
      relations: ['job', 'job.company'],
      order: { applied_at: 'DESC' }
    });
  }

  findByJob(jobId: string) {
    return this.applicationRepo.find({
      where: { job_id: jobId },
      relations: ['student'],
      order: { applied_at: 'DESC' }
    });
  }

  async findOne(id: string) {
    const app = await this.applicationRepo.findOne({
      where: { id },
      relations: ['student', 'job', 'job.company']
    });
    if (!app) throw new NotFoundException('Aplicación no encontrada');
    return app;
  }

  //-----------------------------------------------------------
  // UPDATE STATUS
  //-----------------------------------------------------------
  async updateStatus(id: string, status: ApplicationStatus, notes?: string, changedBy = 'system') {
    const application = await this.findOne(id);

    application.status = status;
    this.updateSpecificDate(application, status);

    const updated = await this.applicationRepo.save(application);

    await this.historyService.createHistoryEntry(
      updated,
      status,
      notes,
      changedBy
    );

    return updated;
  }

  private updateSpecificDate(app: JobApplication, status: ApplicationStatus) {
    const now = new Date();
    if (status === ApplicationStatus.APPLIED) app.applied_at = now;
    if (status === ApplicationStatus.REVIEWED) app.reviewed_at = now;
    if (status === ApplicationStatus.INTERVIEW || status === ApplicationStatus.FINAL_INTERVIEW)
      app.interview_at = now;
    if (status === ApplicationStatus.TECHNICAL_TEST) app.technical_test_at = now;
    if (
      status === ApplicationStatus.REJECTED ||
      status === ApplicationStatus.ACCEPTED ||
      status === ApplicationStatus.WITHDRAWN
    )
      app.decided_at = now;
  }

  //-----------------------------------------------------------
  // THIS IS THE NEW ENDPOINT — FULL CANDIDATE DATA
  //-----------------------------------------------------------
  async getCandidatesForCompany(companyId: string) {
    const jobs = await this.jobRepo.find({ where: { company_id: companyId } });
    if (jobs.length === 0) return [];

    const jobIds = jobs.map(j => j.id);

    const applications = await this.applicationRepo.find({
      where: { job_id: In(jobIds) },
      relations: ['student']
    });

    const results: any[] = [];

    for (const app of applications) {
      const job = jobs.find(j => j.id === app.job_id);
      if (!job) continue;

      const studentId = app.student_id;

      const skills = await this.skillService.getStudentSkills(studentId);
      const projects = await this.projectService.findByStudentId(studentId);
      const certifications = await this.certificationService.findByStudentId(studentId);
      const academicInfo = await this.academicInfoService.findByStudentId(studentId);

      const match = this.calculateMatch(job, skills, projects, certifications);
results.push({
  application_id: app.id,
  job_id: job.id,
  job_title: job.title,

  status: app.status,
  applied_at: app.applied_at,

  student: app.student,

  skills,
  projects,
  certifications,
  academicInfo,

  match
});

     
    }

    return results;
  }
  calculateMatch(job, studentSkills, projects, certifications) {
    const requiredSkills = job.requirements
      ? job.requirements.split(',').map(s => s.trim().toLowerCase())
      : [];

    const skillNames = studentSkills.map(s => s.skill.name.toLowerCase());

    const intersection = requiredSkills.filter(r =>
      skillNames.includes(r)
    );

    const skillScore = requiredSkills.length
      ? (intersection.length / requiredSkills.length) * 60
      : 0;

    let projectScore = projects.length >= 5 ? 20 :
                       projects.length >= 3 ? 15 :
                       projects.length >= 1 ? 10 : 0;

    let certScore = certifications.length >= 3 ? 20 :
                    certifications.length == 2 ? 15 :
                    certifications.length == 1 ? 10 : 0;

    return Math.min(95, Math.round(skillScore + projectScore + certScore));
  }

 
  async checkExistingApplication(studentId: string, jobId: string) {
    const app = await this.applicationRepo.findOne({
      where: { student_id: studentId, job_id: jobId }
    });
    return !!app;
  }
}
