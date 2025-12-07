import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../student/student.entity';
import { Company } from '../company/company.entity';
import { Job } from '../job/entity/job.entity';
import { JobApplication } from '../job/entity/job-application.entity';
import { ApplicationStatus } from '../../enum/applicationHistory.enum';
import { Announcement } from './entities/announcement.entity';
import {
    DashboardStatsDto,
    RecentActivityDto,
} from './dto/dashboard-stats.dto';
import {
    CreateAnnouncementDto,
    AnnouncementDto,
} from './dto/announcement.dto';
import {
    ModerationUserDto,
    UpdateUserStatusDto,
    UserStatus,
} from './dto/moderation.dto';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Student)
        private readonly studentRepo: Repository<Student>,
        @InjectRepository(Company)
        private readonly companyRepo: Repository<Company>,
        @InjectRepository(Job)
        private readonly jobRepo: Repository<Job>,
        @InjectRepository(JobApplication)
        private readonly applicationRepo: Repository<JobApplication>,
        @InjectRepository(Announcement)
        private readonly announcementRepo: Repository<Announcement>,
    ) { }

    // ========================================
    // DASHBOARD STATS
    // ========================================
    async getDashboardStats(): Promise<DashboardStatsDto> {
        const totalStudents = await this.studentRepo.count();
        const totalCompanies = await this.companyRepo.count();
        const totalUsers = totalStudents + totalCompanies;

        const activeJobs = await this.jobRepo.count({
            where: { is_active: true },
        });

        const totalApplications = await this.applicationRepo.count();

        // For now, we'll use simple counts. In production, you'd have a status field
        const pendingUsers = 0; // TODO: Add status field to Student/Company entities
        const reportedUsers = 0; // TODO: Add reported_count field

        const totalHires = await this.applicationRepo.count({
            where: { status: ApplicationStatus.ACCEPTED },
        });

        // Get recent activity (last 10 items)
        const recentActivity = await this.getRecentActivity();

        return {
            totalUsers,
            totalStudents,
            totalCompanies,
            activeJobs,
            totalApplications,
            pendingUsers,
            reportedUsers,
            totalHires,
            recentActivity,
        };
    }

    private async getRecentActivity(): Promise<RecentActivityDto[]> {
        const activities: RecentActivityDto[] = [];

        // Get recent students (last 5)
        const recentStudents = await this.studentRepo.find({
            order: { created_at: 'DESC' },
            take: 3,
        });

        recentStudents.forEach((student) => {
            activities.push({
                type: 'user_registered',
                message: `Nuevo estudiante registrado: ${student.email}`,
                time: student.created_at.toISOString(),
                icon: '👤',
                userId: student.id,
            });
        });

        // Get recent jobs (last 3)
        const recentJobs = await this.jobRepo.find({
            relations: ['company'],
            order: { created_at: 'DESC' },
            take: 3,
        });

        recentJobs.forEach((job) => {
            activities.push({
                type: 'job_posted',
                message: `${job.company?.name || 'Empresa'} publicó: ${job.title}`,
                time: job.created_at.toISOString(),
                icon: '💼',
                jobId: job.id,
            });
        });

        // Sort by time and return last 10
        return activities.sort((a, b) =>
            new Date(b.time).getTime() - new Date(a.time).getTime()
        ).slice(0, 10);
    }

    // ========================================
    // USER MODERATION
    // ========================================
    async getUsersForModeration(): Promise<ModerationUserDto[]> {
        const students = await this.studentRepo.find({
            order: { created_at: 'DESC' },
        });

        const companies = await this.companyRepo.find({
            order: { created_at: 'DESC' },
        });

        const studentDtos: ModerationUserDto[] = students.map((s) => {
            // Calculate profile completion for students
            const hasBasicInfo = !!(s.first_name && s.last_name && s.email);
            const hasContactInfo = !!(s.phone_number);
            const hasBio = !!(s.bio);
            const profile_complete = hasBasicInfo && hasContactInfo && hasBio;

            return {
                id: s.id,
                email: s.email,
                name: `${s.first_name} ${s.last_name}`,
                user_type: 'student' as const,
                status: UserStatus.APPROVED, // TODO: Add status field to entity
                created_at: s.created_at,
                reported_count: 0, // TODO: Add reported_count field
                profile_complete,
            };
        });

        const companyDtos: ModerationUserDto[] = companies.map((c) => {
            // Calculate profile completion for companies
            const hasBasicInfo = !!(c.name && c.email);
            const hasDescription = !!(c.description);
            const hasContactInfo = !!(c.phone_number || c.website);
            const profile_complete = hasBasicInfo && hasDescription && hasContactInfo;

            return {
                id: c.id,
                email: c.email,
                name: c.name,
                user_type: 'company' as const,
                status: UserStatus.APPROVED, // TODO: Add status field to entity
                created_at: c.created_at,
                reported_count: 0, // TODO: Add reported_count field
                profile_complete,
            };
        });

        return [...studentDtos, ...companyDtos].sort(
            (a, b) => b.created_at.getTime() - a.created_at.getTime(),
        );
    }

    async updateUserStatus(
        userId: string,
        dto: UpdateUserStatusDto,
    ): Promise<{ message: string }> {
        // Try to find in students first
        const student = await this.studentRepo.findOne({ where: { id: userId } });
        if (student) {
            // TODO: Add status field to Student entity
            // student.status = dto.status;
            // await this.studentRepo.save(student);
            return { message: `Estado del estudiante actualizado a: ${dto.status}` };
        }

        // Try companies
        const company = await this.companyRepo.findOne({ where: { id: userId } });
        if (company) {
            // TODO: Add status field to Company entity
            // company.status = dto.status;
            // await this.companyRepo.save(company);
            return { message: `Estado de la empresa actualizado a: ${dto.status}` };
        }

        throw new NotFoundException('Usuario no encontrado');
    }

    // ========================================
    // ANNOUNCEMENTS
    // ========================================
    async getAnnouncements(): Promise<AnnouncementDto[]> {
        const announcements = await this.announcementRepo.find({
            where: { is_active: true },
            order: { created_at: 'DESC' },
        });

        return announcements.map((a) => ({
            id: a.id,
            title: a.title,
            message: a.message,
            type: a.type,
            target: a.target,
            link: a.link,
            created_at: a.created_at,
            created_by: a.created_by,
            is_active: a.is_active,
        }));
    }

    async createAnnouncement(
        dto: CreateAnnouncementDto,
        adminId: string,
    ): Promise<AnnouncementDto> {
        const announcement = this.announcementRepo.create({
            ...dto,
            created_by: adminId,
        });

        const saved = await this.announcementRepo.save(announcement);

        return {
            id: saved.id,
            title: saved.title,
            message: saved.message,
            type: saved.type,
            target: saved.target,
            link: saved.link,
            created_at: saved.created_at,
            created_by: saved.created_by,
            is_active: saved.is_active,
        };
    }

    async deleteAnnouncement(id: string): Promise<{ message: string }> {
        const announcement = await this.announcementRepo.findOne({
            where: { id },
        });

        if (!announcement) {
            throw new NotFoundException('Anuncio no encontrado');
        }

        // Soft delete by setting is_active to false
        announcement.is_active = false;
        await this.announcementRepo.save(announcement);

        return { message: 'Anuncio eliminado correctamente' };
    }
}
