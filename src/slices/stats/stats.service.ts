import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Student } from '../student/student.entity';
import { Company } from '../company/company.entity';
import { Job } from '../job/entity/job.entity';
import { JobApplication } from '../job/entity/job-application.entity';
import { ApplicationStatus } from '../../enum/applicationHistory.enum';

export interface MonthlyTrend {
    month: string;
    students: number;
    companies: number;
    jobs: number;
    applications: number;
}

@Injectable()
export class StatsService {
    constructor(
        @InjectRepository(Student)
        private readonly studentRepo: Repository<Student>,
        @InjectRepository(Company)
        private readonly companyRepo: Repository<Company>,
        @InjectRepository(Job)
        private readonly jobRepo: Repository<Job>,
        @InjectRepository(JobApplication)
        private readonly applicationRepo: Repository<JobApplication>,
    ) { }

    async getDashboardStats() {
        const [
            totalStudents,
            totalCompanies,
            totalJobs,
            totalApplications,
            activeJobs,
            pendingApplications,
        ] = await Promise.all([
            this.studentRepo.count(),
            this.companyRepo.count(),
            this.jobRepo.count(),
            this.applicationRepo.count(),
            this.jobRepo.count({ where: { is_active: true } }),
            this.applicationRepo.count({ where: { status: ApplicationStatus.APPLIED } }),
        ]);

        // Calcular crecimiento (últimos 30 días vs 30 días anteriores)
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        const [
            studentsLast30,
            studentsPrevious30,
            companiesLast30,
            companiesPrevious30,
            jobsLast30,
            jobsPrevious30,
            applicationsLast30,
            applicationsPrevious30,
        ] = await Promise.all([
            this.studentRepo.count({
                where: { created_at: Between(thirtyDaysAgo, now) as any },
            }),
            this.studentRepo.count({
                where: { created_at: Between(sixtyDaysAgo, thirtyDaysAgo) as any },
            }),
            this.companyRepo.count({
                where: { created_at: Between(thirtyDaysAgo, now) as any },
            }),
            this.companyRepo.count({
                where: { created_at: Between(sixtyDaysAgo, thirtyDaysAgo) as any },
            }),
            this.jobRepo.count({
                where: { created_at: Between(thirtyDaysAgo, now) as any },
            }),
            this.jobRepo.count({
                where: { created_at: Between(sixtyDaysAgo, thirtyDaysAgo) as any },
            }),
            this.applicationRepo.count({
                where: { created_at: Between(thirtyDaysAgo, now) as any },
            }),
            this.applicationRepo.count({
                where: { created_at: Between(sixtyDaysAgo, thirtyDaysAgo) as any },
            }),
        ]);

        const calculateGrowth = (current: number, previous: number) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        return {
            students: {
                total: totalStudents,
                growth: calculateGrowth(studentsLast30, studentsPrevious30),
            },
            companies: {
                total: totalCompanies,
                growth: calculateGrowth(companiesLast30, companiesPrevious30),
            },
            jobs: {
                total: totalJobs,
                active: activeJobs,
                growth: calculateGrowth(jobsLast30, jobsPrevious30),
            },
            applications: {
                total: totalApplications,
                pending: pendingApplications,
                growth: calculateGrowth(applicationsLast30, applicationsPrevious30),
            },
        };
    }

    async getStudentStats() {
        const total = await this.studentRepo.count();

        return {
            total,
            active: total, // Todos los estudiantes se consideran activos por ahora
            verified: total, // Todos verificados por ahora
            inactive: 0,
        };
    }

    async getCompanyStats() {
        const total = await this.companyRepo.count();

        return {
            total,
            verified: total, // Todas verificadas por ahora
            unverified: 0,
        };
    }

    async getJobStats() {
        const total = await this.jobRepo.count();
        const active = await this.jobRepo.count({ where: { is_active: true } });
        const closed = await this.jobRepo.count({ where: { is_active: false } });

        return {
            total,
            active,
            closed,
        };
    }

    async getApplicationStats() {
        const total = await this.applicationRepo.count();
        const pending = await this.applicationRepo.count({
            where: { status: ApplicationStatus.APPLIED },
        });
        const accepted = await this.applicationRepo.count({
            where: { status: ApplicationStatus.ACCEPTED },
        });
        const rejected = await this.applicationRepo.count({
            where: { status: ApplicationStatus.REJECTED },
        });

        return {
            total,
            pending,
            accepted,
            rejected,
        };
    }

    async getMonthlyTrends(): Promise<MonthlyTrend[]> {
        // Obtener datos de los últimos 6 meses
        const now = new Date();
        const monthRanges: Array<{ monthStart: Date; monthEnd: Date }> = [];

        // Crear rangos de meses
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(
                now.getFullYear(),
                now.getMonth() - i,
                1,
            );
            const monthEnd = new Date(
                now.getFullYear(),
                now.getMonth() - i + 1,
                0,
            );
            monthRanges.push({ monthStart, monthEnd });
        }

        // Ejecutar todas las consultas en paralelo
        const monthResults = await Promise.all(
            monthRanges.map(async ({ monthStart, monthEnd }) => {
                const [students, companies, jobs, applications] = await Promise.all([
                    this.studentRepo.count({
                        where: { created_at: Between(monthStart, monthEnd) as any },
                    }),
                    this.companyRepo.count({
                        where: { created_at: Between(monthStart, monthEnd) as any },
                    }),
                    this.jobRepo.count({
                        where: { created_at: Between(monthStart, monthEnd) as any },
                    }),
                    this.applicationRepo.count({
                        where: { created_at: Between(monthStart, monthEnd) as any },
                    }),
                ]);

                return {
                    month: monthStart.toLocaleDateString('es-ES', {
                        month: 'short',
                        year: 'numeric',
                    }),
                    students,
                    companies,
                    jobs,
                    applications,
                };
            })
        );

        return monthResults;
    }

    async getJobsByCategory() {
        // Obtener todos los jobs activos
        const jobs = await this.jobRepo.find({
            where: { is_active: true }
        });

        // Categorías predefinidas y palabras clave
        const categories: Record<string, string[]> = {
            'Desarrollo': ['React', 'Node', 'Python', 'Java', 'C#', 'JavaScript', 'TypeScript', 'Full Stack', 'Backend', 'Frontend', 'Developer', 'Programador'],
            'Datos': ['Data', 'Analytics', 'SQL', 'Big Data', 'Machine Learning', 'ML', 'Python', 'Data Science'],
            'Otros': []
        };

        // Contar jobs por categoría
        const categoryCounts: Record<string, number> = {
            'Desarrollo': 0,
            'Datos': 0,
            'Otros': 0
        };

        jobs.forEach(job => {
            const jobText = `${job.title} ${job.requirements || ''}`.toLowerCase();
            let categorized = false;

            for (const [category, keywords] of Object.entries(categories)) {
                if (category !== 'Otros' && keywords.some((keyword: string) => jobText.includes(keyword.toLowerCase()))) {
                    categoryCounts[category]++;
                    categorized = true;
                    break;
                }
            }

            if (!categorized) {
                categoryCounts['Otros']++;
            }
        });

        // Calcular total y porcentajes
        const total = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
        
        const result = Object.entries(categoryCounts).map(([category, count]) => ({
            name: category,
            value: count,
            percentage: total > 0 ? Math.round((count / total) * 100) : 0
        }));

        return result;
    }

    async getRecentActivity(limit: number = 10) {
        // Obtener últimas aplicaciones
        const recentApplications = await this.applicationRepo.find({
            relations: ['student', 'job'],
            order: { created_at: 'DESC' },
            take: limit,
        });

        // Obtener últimos trabajos creados
        const recentJobs = await this.jobRepo.find({
            relations: ['company'],
            order: { created_at: 'DESC' },
            take: limit,
        });

        // Obtener últimos estudiantes registrados
        const recentStudents = await this.studentRepo.find({
            order: { created_at: 'DESC' },
            take: limit,
        });

        // Mapear actividades con tipo y datos relevantes
        const activities: Array<{
            id: string;
            type: string;
            description: string;
            timestamp: Date;
            icon: string;
            color: string;
            details: string;
        }> = [];

        // Agregar aplicaciones
        recentApplications.forEach(app => {
            activities.push({
                id: app.id,
                type: 'application',
                description: `Postulación a "${app.job.title}"`,
                timestamp: app.created_at,
                icon: '📝',
                color: '#3b82f6',
                details: `${app.student?.first_name || 'Usuario'} aplicó`
            });
        });

        // Agregar nuevos trabajos
        recentJobs.forEach(job => {
            activities.push({
                id: job.id,
                type: 'job',
                description: `Nueva oferta: "${job.title}"`,
                timestamp: job.created_at,
                icon: '💼',
                color: '#10b981',
                details: `${job.company?.name || 'Empresa'} publicó`
            });
        });

        // Agregar nuevos estudiantes
        recentStudents.forEach(student => {
            activities.push({
                id: student.id,
                type: 'student',
                description: `Nuevo estudiante registrado`,
                timestamp: student.created_at,
                icon: '👤',
                color: '#8b5cf6',
                details: `${student.first_name} ${student.last_name}`
            });
        });

        // Ordenar por fecha más reciente y tomar los últimos
        return activities
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit);
    }

    async getFullReport(startDate?: string, endDate?: string) {
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();

        const [dashboardStats, studentStats, companyStats, jobStats, applicationStats, trends] =
            await Promise.all([
                this.getDashboardStats(),
                this.getStudentStats(),
                this.getCompanyStats(),
                this.getJobStats(),
                this.getApplicationStats(),
                this.getMonthlyTrends(),
            ]);

        return {
            period: {
                start: start.toISOString(),
                end: end.toISOString(),
            },
            dashboard: dashboardStats,
            students: studentStats,
            companies: companyStats,
            jobs: jobStats,
            applications: applicationStats,
            trends,
            generatedAt: new Date().toISOString(),
        };
    }
}
