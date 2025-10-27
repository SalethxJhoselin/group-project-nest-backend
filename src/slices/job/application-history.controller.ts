import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApplicationHistoryService } from './application-history.service';
import { ApplicationHistory } from './entity/application-history.entity';

@ApiTags('application-history')
@Controller('application-history')
export class ApplicationHistoryController {
  constructor(private readonly historyService: ApplicationHistoryService) { }

  @Get('application/:applicationId')
  @ApiOperation({ summary: 'Obtener historial completo de una aplicación' })
  @ApiResponse({ status: 200, type: [ApplicationHistory] })
  async getApplicationHistory(@Param('applicationId') applicationId: string): Promise<ApplicationHistory[]> {
    return await this.historyService.getApplicationHistory(applicationId);
  }

  @Get('application/:applicationId/timeline')
  @ApiOperation({ summary: 'Obtener timeline completo con métricas' })
  async getFullTimeline(@Param('applicationId') applicationId: string) {
    return await this.historyService.getFullApplicationTimeline(applicationId);
  }

  @Get('application/:applicationId/last-change')
  @ApiOperation({ summary: 'Obtener último cambio de estado' })
  async getLastStatusChange(@Param('applicationId') applicationId: string) {
    return await this.historyService.getLastStatusChange(applicationId);
  }

  @Get('application/:applicationId/changes-count')
  @ApiOperation({ summary: 'Obtener cantidad de cambios de estado' })
  async getStatusChangesCount(@Param('applicationId') applicationId: string) {
    const count = await this.historyService.getStatusChangesCount(applicationId);
    return { changes_count: count };
  }
}