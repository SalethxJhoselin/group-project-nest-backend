export class DashboardStatsDto {
    totalUsers: number;
    totalStudents: number;
    totalCompanies: number;
    activeJobs: number;
    totalApplications: number;
    pendingUsers: number;
    reportedUsers: number;
    totalHires: number;
    recentActivity: RecentActivityDto[];
}

export class RecentActivityDto {
    type: 'user_registered' | 'job_posted' | 'user_reported' | 'company_registered' | 'application_submitted';
    message: string;
    time: string;
    icon: string;
    userId?: string;
    jobId?: string;
}
