import { Controller, Get, Query } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('admin/stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) { }

    @Get('dashboard')
    async getDashboardStats() {
        return this.statsService.getDashboardStats();
    }

    @Get('students')
    async getStudentStats() {
        return this.statsService.getStudentStats();
    }

    @Get('companies')
    async getCompanyStats() {
        return this.statsService.getCompanyStats();
    }

    @Get('jobs/by-category')
    async getJobsByCategory() {
        return this.statsService.getJobsByCategory();
    }

    @Get('jobs')
    async getJobStats() {
        return this.statsService.getJobStats();
    }

    @Get('applications')
    async getApplicationStats() {
        return this.statsService.getApplicationStats();
    }

    @Get('trends/monthly')
    async getMonthlyTrends() {
        return this.statsService.getMonthlyTrends();
    }

    @Get('activity/recent')
    async getRecentActivity(@Query('limit') limit?: string) {
        return this.statsService.getRecentActivity(limit ? parseInt(limit) : 10);
    }

    @Get('report')
    async getFullReport(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.statsService.getFullReport(startDate, endDate);
    }
}
