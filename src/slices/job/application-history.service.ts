import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationStatus } from 'src/enum/applicationHistory.enum';
import { Repository } from 'typeorm';
import { ApplicationHistory } from './entity/application-history.entity';
import { JobApplication } from './entity/job-application.entity';

@Injectable()
export class ApplicationHistoryService {
  constructor(
    @InjectRepository(ApplicationHistory)
    private historyRepo: Repository<ApplicationHistory>,
  ) { }

  async createHistoryEntry(
    application: JobApplication,
    status: ApplicationStatus,
    notes?: string,
    changedBy: string = 'system'
  ): Promise<ApplicationHistory> {
    const historyEntry = this.historyRepo.create({
      application_id: application.id,
      status,
      notes,
      changed_by: changedBy
    });

    return await this.historyRepo.save(historyEntry);
  }

  async getApplicationHistory(applicationId: string): Promise<ApplicationHistory[]> {
    return await this.historyRepo.find({
      where: { application_id: applicationId },
      order: { changed_at: 'ASC' }
    });
  }

  async getFullApplicationTimeline(applicationId: string): Promise<{
    current_status: ApplicationStatus;
    timeline: ApplicationHistory[];
    total_days: number;
  }> {
    const [application, history] = await Promise.all([
      this.historyRepo.manager.getRepository(JobApplication).findOne({
        where: { id: applicationId }
      }),
      this.getApplicationHistory(applicationId)
    ]);

    if (!application) {
      throw new Error('Aplicación no encontrada');
    }

    let totalDays = 0;
    if (history.length > 0) {
      const firstDate = history[0].changed_at;
      const lastDate = history[history.length - 1].changed_at;
      totalDays = Math.ceil(
        (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    return {
      current_status: application.status,
      timeline: history,
      total_days: totalDays
    };
  }

  async getStatusChangesCount(applicationId: string): Promise<number> {
    return await this.historyRepo.count({
      where: { application_id: applicationId }
    });
  }

  async getLastStatusChange(applicationId: string): Promise<ApplicationHistory | null> {
    const history = await this.historyRepo.find({
      where: { application_id: applicationId },
      order: { changed_at: 'DESC' },
      take: 1
    });

    return history.length > 0 ? history[0] : null;
  }
}